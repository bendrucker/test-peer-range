'use strict'

import test from '../'
import yargs from 'yargs'
import prop from 'dot-prop'
import {resolve} from 'path'
import {cwd} from 'process'

const {argv} = yargs.demand(1).default('script', 'test-main')
const [peer] = argv._
const {script} = argv
const pkg = require(resolve(cwd(), 'package.json'))
const range = prop.get(pkg, `peerDependencies.${peer}`)

test(peer, range, script).catch(fail)

function fail (err) {
  console.error(err)
  console.error(err.stack)
  process.exit(1)
}