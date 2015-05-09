# test-peer-range [![Build Status](https://travis-ci.org/bendrucker/test-peer-range.svg?branch=master)](https://travis-ci.org/bendrucker/test-peer-range)

> Test a plugin against the full range of major supported versions of its parent

## Install

```
$ npm install --save-dev test-peer-range
```


## Usage

```sh
$ test-peer-range browserify
```

## CLI

The name of your peer dependency should be passed as an argument. 

#### `--script`

Specify a test script specified in `scripts` in your package.json.

Default: `test-main`

#### `--bail`

Exit immediately when any test fails. Use `--no-bail` to disable bailing. 

Default: `true`

## API

```js
var Runner = require('test-peer-range').Runner
```

### `new Runner(name, range, [options])`

#### name

*Required*  
Type: `string`

The name of the peer to test against.

#### range

*Required*
Type: `string`

The semver range of the peer versions to use for testing.

##### options

* `script`: The npm script to run
  * type: `string`
  * default: `'test-main'`
* `bail`: Immediately end the run when a test fails
  * type: `boolean`
  * default: `true`

### `runner.run()` -> `promise(results)`

Runs the tests and returns an promise that resolves to an array of results. Each result will have a `version` and `passed` (`boolean`) property.

## License

MIT © [Ben Drucker](http://bendrucker.me)
