'use strict'

const assert = require('assert')
const pkgVersions = require('pkg-versions')
const majors = require('major-versions')
const semver = require('semver')
const { EventEmitter } = require('events')
const eavesdrop = require('eavesdrop')
const run = require('run-versions')
const unique = require('array-uniq')

// defaults for run-versions
const defaults = {
  // use an npm script
  npm: true,
  // default to npm run test-main
  command: 'test-main',
  // also test the following specific versions
  versions: []
}

module.exports = testPeer

function testPeer (name, range, options, callback) {
  assert(name, 'Peer name must be defined')
  assert(range, 'Peer range must be defined')
  options = Object.assign({}, defaults, options, { name })

  const events = new EventEmitter()

  pkgVersions(name)
    .then(function (versions) {
      const latest = semver.maxSatisfying(Array.from(versions), range)
      options.versions = unique([].concat(options.versions).concat(majors(range, latest)))
      console.log(options.versions)
      events.emit('versions', options.versions)

      const runner = run(options, callback)
      eavesdrop(runner, events)
    })
    .catch(callback)

  return events
}
