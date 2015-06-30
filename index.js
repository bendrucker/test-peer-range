'use strict'

var assert = require('assert')
var extend = require('xtend')
var ap = require('ap')
var latest = require('latest-version')
var majors = require('major-versions')
var EventEmitter = require('events').EventEmitter
var eavesdrop = require('eavesdrop')
var run = require('run-versions')

// defaults for run-versions
var applyDefaults = ap.partial(extend, {
  // use an npm script
  npm: true,
  // default to npm run test-main
  command: 'test-main'
})

module.exports = function testRange (name, range, options, callback) {
  assert(name, 'Peer name must be defined')
  assert(range, 'Peer range must be defined')
  options = applyDefaults(options, {name: name})

  var events = new EventEmitter()

  latest(name, function (err, version) {
    if (err) return callback(err)
    options.versions = majors(range, version)
    events.emit('versions', options.versions)
    var runner = run(options, callback)
    eavesdrop(runner, events)
  })

  return events
}
