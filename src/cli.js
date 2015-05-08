'use strict'

import test from '../'
import yargs from 'yargs'

const {argv} = yargs.demand(1)
const [peer] = argv._

test(peer).catch(fail)

function fail (err) {
  console.err(err)
  process.exit(1)
}