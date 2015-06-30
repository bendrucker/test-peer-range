'use strict'

var test = require('tape')
var path = require('path')
var execFile = require('child_process').execFile

var cliPath = path.resolve(__dirname, '../cli.js')

test('cli', function (t) {
  t.plan(2)
  var options = {
    cwd: path.resolve(__dirname, 'fixture')
  }
  execFile(cliPath, ['xtend'], options, function (err, stdout, stderr) {
    if (err) return t.end(err)
    t.ok(/Passed: 2, 3, 4/.test(stdout))
    t.ok(/Failed: None/.test(stdout))
  })
})
