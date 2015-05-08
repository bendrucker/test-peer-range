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
    return promisify(npm.commands.view)([this.name, 'dist-tags.latest'])
      .then(v => majorVersions(this.range, v))
      .tap((versions) => this.emit('versions', versions))
  }
  install (version = '') {
    this.emit('preinstall', version)
    return promisify(npm.commands.install)([`${this.name}@${version}`])
      .then(() => this.emit('postinstall', version))
      .return(version)
  }
  uninstall () {
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
        const result = {version}
        if (promise.isFulfilled()) {
          return Object.assign(result, {
            passed: true
          })
        }
        if (this.options.bail) {
          throw promise.reason()
        }
        return Object.assign(result, {
          passed: false
        })
      })
  }
  test (version) {
    return this.install(version)
      .bind(this)
      .then(this.runScript)
      .tap(this.uninstall)
  }
  run () {
    return load()
      .bind(this)
      .then(this.versions)
      .map(this.test, {
        concurrency: 1
      })
      .tap(() => this.install())
  }
}

function load () {
  return promisify(npm.load)()
}