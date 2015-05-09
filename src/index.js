'use strict'

import majorVersions from 'major-versions'
import array from 'ensure-array'
import npm from 'npm'
import {promisify} from 'bluebird'
import {resolve} from 'path'
import assert from 'assert'
import {partial} from 'ap'
import {EventEmitter} from 'events'
import defaults from 'defaults'

export class Runner extends EventEmitter {
  constructor (name, range, options = {}) {
    super()
    assert(name, 'Peer name must be defined')
    assert(range, 'Peer range must be defined')
    defaults(options, {
      script: 'test-main',
      bail: true
    })
    Object.assign(this, {name, range, options})
  }
  versions () {
    return promisify(npm.commands.view)([this.name, 'dist-tags.latest'], true)
      .then(v => majorVersions(this.range, v))
      .tap((versions) => this.emit('versions', versions))
  }
  install (version = '') {
    this.emit('preinstall', version)
    return promisify(npm.commands.install)([`${this.name}@${version}`])
      .then(() => this.emit('postinstall', version))
      .return(version)
  }
  uninstall (version) {
    this.emit('preuninstall', version)
    return promisify(npm.commands.uninstall)(this.name)
      .then(() => this.emit('postuninstall', version))
  }
  runScript (version) {
    this.emit('prescript', version)
    return promisify(npm.commands.runScript)([this.options.script])
      .reflect()
      .tap(() => this.emit('postscript', version))
      .then((promise) => {
        const result = {
          passed: promise.isFulfilled(),
          version
        }
        this.emit('result', result)
        if (this.options.bail && !result.passed) {
          throw promise.reason()
        }
        return result
      })
  }
  test (version) {
    return this.install(version)
      .bind(this)
      .then(this.runScript)
      .tap(() => this.uninstall(version))
  }
  run () {
    return load()
      .bind(this)
      .then(this.versions)
      .reduce((results, version) => {
        return this.test(version)
          .bind(results)
          .then(results.concat)
      }, [])
      .tap(() => this.install())
  }
}

function load () {
  return promisify(npm.load)()
}