#!/usr/bin/env node

'use strict'

var path = require('path')
var main = path.dirname(require.resolve('../'))

require(path.resolve(main, './cli'))