'use strict'

const test = require('tape')
const path = require('path')
const execFile = require('child_process').execFile

const cliPath = path.resolve(__dirname, '../cli.js')

test('cli', function (t) {
  t.plan(2)
  const options = {
    cwd: path.resolve(__dirname, 'fixture')
  }
  execFile(cliPath, ['xtend'], options, function (err, stdout, stderr) {
    if (err) return t.end(err)
    stdout = stdout.toString()
    t.ok(stdout.includes('Passed: 2, 3, 4'), 'stdout includes 3 passing versions')
    t.ok(stdout.includes('Failed: None'), 'stdout includes no failing versions')
  })
})

test('--versions', function (t) {
  t.plan(2)
  const options = {
    cwd: path.resolve(__dirname, 'fixture')
  }
  execFile(cliPath, ['xtend', '-v', '2.1.1', '-v', '2.2.0'], options, function (err, stdout, stderr) {
    if (err) return t.end(err)
    stdout = stdout.toString()
    t.ok(stdout.includes('Passed: 2.1.1, 2.2.0, 2, 3, 4'), 'stdout includes 5 passing versions')
    t.ok(stdout.includes('Failed: None'), 'stdout includes no failing versions')
  })
})

test.only('arguments', function (t) {
  t.plan(1)
  const options = {
    cwd: path.resolve(__dirname, 'fixture')
  }
  execFile(cliPath, ['xtend', '-c', 'echo', 'foo'], options, function (err, stdout, stderr) {
    if (err) return t.end(err)
    stdout = stdout.toString()
    t.ok(stdout.includes('Arguments: ["foo"]'), 'passes arguments after 0 to command')
  })
})
