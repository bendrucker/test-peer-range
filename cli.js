#!/usr/bin/env node

'use strict'

const testRange = require('./')
const meow = require('meow')
const mothership = require('mothership')
const dot = require('dot-prop')
const log = require('clout')('test-peer-range')

const cli = meow(`
  Usage
    test-peer-range <package>       Tests the latest of each major version of the peer package

  Options
    --versions, -v <v1> -v <v2...>  additional versions to test
    --command, -c <command>         the test command (default: "test-main")
    --npm                           treat the command as an npm script (default: true)
    --bail                          exit immediately after failure (default: false)
`, {
  flags: {
    npm: {
      type: 'boolean',
      default: true
    },
    command: {
      type: 'string',
      alias: 'c',
      default: 'test-main'
    },
    bail: {
      type: 'boolean',
      default: false
    },
    versions: {
      type: 'string',
      alias: 'v',
      default: [],
      isMultiple: true
    }
  }
})

const name = cli.input[0]
if (!name) cli.showHelp()

function getPeer (pack) {
  return dot.get(pack, 'peerDependencies.' + name)
}

const pkg = mothership.sync(process.cwd(), getPeer)
if (!pkg) fail('No peerDep found for ' + name)
const range = getPeer(pkg.pack)

const defaults = {
  arguments: [],
  child_process: {
    stdio: 'inherit'
  }
}
const options = Object.assign({}, defaults, cli.flags, { arguments: cli.input.slice(1) })

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
    const outcome = passed ? 'Passed' : 'Failed'
    log('%s: %s@%s', outcome, name, version)
  })

function done (err, results) {
  if (err) return fail(err)
  const passedOn = results.filter(passed).map(version)
  const failedOn = results.filter(failed).map(version)
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
