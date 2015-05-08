'use strict'

import majorVersions from 'major-versions'
import array from 'ensure-array'
import npm from 'npm'
import {promisify} from 'bluebird'
import {cwd} from 'process'
import {resolve} from 'path'
import assert from 'assert'
import {partial} from 'ap'
import {EventEmitter} from 'events'

export class Runner extends EventEmitter {
  constructor (name, range, script = 'test-main') {
    assert(name, 'Peer name must be defined')
    assert(range, 'Peer range must be defined')
    Object.assign(this, {name, range, script})
  }
  versions () {
    return promisify(npm.commands.view)([name, 'dist-tags.latest'])
      .then(v => majorVersions(range, v))
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
    return promisify(npm.commands.runScript)([this.script])
      .then(() => this.emit('postscript', version))
  }
  test (version) {
    return this.install(version)
      .bind(this)
      .then(this.runScript)
      .then(this.uninstall)
  }
  run () {
    return load()
      .bind(this)
      .then(this.versions)
      .each(this.test)
      .then(() => this.install)
  }
}

function load () {
  return promisify(npm.load)()
}