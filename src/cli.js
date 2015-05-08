'use strict'

import {Runner} from '../'
import yargs from 'yargs'
import prop from 'dot-prop'
import {resolve} from 'path'
import {createLogger} from 'clout'

const {cwd} = process
const pkg = require(resolve(cwd(), 'package.json'))
const log = createLogger(pkg.name)

const {argv} = yargs
  .demand(1)
  .option('script', {
    default: 'test-main',
    describe: 'test script'
  })
const [peer] = argv._
const {script, verbose} = argv
const range = prop.get(pkg, `peerDependencies.${peer}`)

new Runner(peer, range, {script})
  .on('versions', (versions) => {
    log(`Testing ${peer} versions ${versions.join(', ')}`)
  })
  .on('preinstall', (version) => {
    log(`Installing ${peer}@${version}`)
  })
  .on('postinstall', (version) => {
    log(`Installed ${peer}@${version}`)
  })
  .on('prescript', (version) => {
    log(`Starting "${script}" for ${peer}@${version}`)
  })
  .on('result', ({passed, version}) => {
    const outcome = passed ? 'Passed' : 'Failed'
    log(`${outcome}: ${peer}@${version}`)
  })
  .run()
  .catch(fail)

function fail (err) {
  log.error(err)
  console.error(err.stack)
  process.exit(1)
}