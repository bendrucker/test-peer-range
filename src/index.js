'use strict'

import majorVersions from 'major-versions'
import array from 'ensure-array'
import npm from 'npm'
import Promise from 'bluebird'
import {cwd} from 'process'
import {resolve} from 'path'
import assert from 'assert'
import {partial} from 'ap'
const pkg = require(resolve(cwd(), 'package.json'))

Promise.promisifyAll(npm)

export default function testPeer (name, range, script) {
  return majors(name, range).each(partial(run, name, script))
}

function run (name, script, version) {
  return install(name, version)
    .return(script)
    .then(runScript)
    .return(name)
    .then(uninstall)
}

function majors (name, range) {
  assert(name, 'Peer name must be defined')
  assert(range, 'Peer range must be defined')
  return npm.viewAsync([name, 'versions.latest'])
    .then(v => majorVersions(range, v))
}

function runScript (name) {
  return npm.runScriptAsync(name)
}

function install (name, version) {
  return npm.installAsync([`${name}@${version}`])
}

function uninstall (name) {
  return npm.uninstallAsync(name)
}