'use strict'

import majors from 'major-versions'
import array from 'ensure-array'
import originalNpm from 'npm'
import Promise from 'bluebird'

const npm = Promise.promisifyAll(npm)
