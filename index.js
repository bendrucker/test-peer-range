'use strict'

const assert = require('assert')
const latest = require('latest-version')
const majors = require('major-versions')
const { EventEmitter } = require('events')
const eavesdrop = require('eavesdrop')
const run = require('run-versions')

// defaults for run-versions
const defaults = {
  // use an npm script
  npm: true,
  // default to npm run test-main
  command: 'test-main'
}

module.exports = testPeer

function testPeer (name, range, options, callback) {
  assert(name, 'Peer name must be defined')
  assert(range, 'Peer range must be defined')
  options = Object.assign({}, defaults, options, { name })

  const events = new EventEmitter()

  latest(name)
    .then(function (version) {
      options.versions = majors(range, version)
      events.emit('versions', options.versions)
      const runner = run(options, callback)
      eavesdrop(runner, events)
    })
    .catch(callback)

  return events
}
