#!/usr/bin/env node

'use strict'

var testRange = require('./')
var meow = require('meow')
var mothership = require('mothership')
var dot = require('dot-prop')
var extend = require('xtend')
var log = require('clout')('test-peer-range')

var minimist = {
  boolean: ['npm', 'bail'],
  default: {
    npm: true,
    command: 'test-main'
  }
}

var cli = meow({
  help: [
    'Usage',
    '  test-peer-range <name>',
    'Options',
    '  --command <command>   the test command (default: "test-main")',
    '  --npm                 treat the command as an npm script (default: true)',
    '  --bail                exit immediately after failure (default: false)'
  ]
}, minimist)

var name = cli.input[0]

if (!name) {
  console.log('Usage: test-peer-range <name>')
  process.exit(1)
}

function getPeer (pack) {
  return dot.get(pack, 'peerDependencies.' + name)
}

var pkg = mothership.sync(process.cwd(), getPeer)
if (!pkg) fail('No peerDep found for ' + name)
var range = getPeer(pkg.pack)

var defaults = {
  child_process: {
    stdio: 'inherit'
  }
}
var options = extend(defaults, cli.flags)

testRange(name, range, options, done)
  .on('versions', function (versions) {
    log('Testing %s versions: %s', name, versions.join(', '))
  })
  .on('preinstall', function (version) {
    log('Installing %s@%s', name, version)
  })
  .on('postinstall', function (version) {
    log('Installed %s@%s', name, version)
  })
  .on('prescript', function (version) {
    log('Starting "%s" for %s@%s', options.command, name, version)
  })
  .on('result', function (version, passed) {
    var outcome = passed ? 'Passed' : 'Failed'
    log('%s: %s@%s', outcome, name, version)
  })

function done (err, results) {
  if (err) return fail(err)
  var passedOn = results.filter(passed).map(version)
  var failedOn = results.filter(failed).map(version)
  log('Passed:', passedOn.join(', ') || 'None')
  log('Failed:', failedOn.join(', ') || 'None')
  if (failedOn.length) process.exit(1)
}

function passed (result) {
  return result.passed
}

function failed (result) {
  return !result.passed
}

function version (result) {
  return result.version
}

function fail (err) {
  log.error(err)
  process.exit(1)
}
