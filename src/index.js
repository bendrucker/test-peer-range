'use strict'

import majorVersions from 'major-versions'
import array from 'ensure-array'
import npm from 'npm'
import {promisify} from 'bluebird'
import {cwd} from 'process'
import {resolve} from 'path'
import assert from 'assert'
import {partial} from 'ap'

export default function testPeer (name, range, script) {
  return load()
    .return([name, range])
    .spread(majors)
    .each(partial(run, name, script))
}

function majors (name, range) {
  assert(name, 'Peer name must be defined')
  assert(range, 'Peer range must be defined')
  return promisify(npm.commands.view)([name, 'dist-tags.latest'])
    .then(v => majorVersions(range, v))
}

function load () {
  return promisify(npm.load)()
}

function run (name, script, version) {
  return install(name, version)
    .return(script)
    .then(runScript)
    .return(name)
    .then(uninstall)
}

function install (name, version) {
  return promisify(npm.commands.install)([`${name}@${version}`])
}

function runScript (name) {
  return promisify(npm.commands.runScript)([name])
}

function uninstall (name) {
  return promisify(npm.commands.uninstall)(name)
}