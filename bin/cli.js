'use strict'

const test = require('../')
const argv = require('yargs').demand(1).argv

test(argv[0]).catch(fail)

function fail (err) {
  console.err(err)
  process.exit(1)
}