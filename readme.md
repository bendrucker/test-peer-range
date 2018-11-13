# test-peer-range [![Build Status](https://travis-ci.org/bendrucker/test-peer-range.svg?branch=master)](https://travis-ci.org/bendrucker/test-peer-range)

> Test a plugin against the full range of major supported versions of its parent

## Install

```
npm install --save-dev test-peer-range
```

## Usage

```sh
$ test-peer-range browserify
```

## CLI

#### `test-peer-range <name>`

##### name

*Required*  
Type: `string`

The package name of the peer.

##### --command

Type: `string`  
Default: `test-main`

A command to run for each version. By default this is expected to be an npm script.

##### --npm

Type: `boolean`  
Default: `true`

Disable npm to run the --command directly.

##### --bail

Type: `boolean`  
Default: `false`

Exit immediately when any test fails. 

## API

#### `run(name, range, [options], callback)`

##### name

*Required*  
Type: `string`

The name of the peer to test against.

##### range

*Required*  
Type: `string`

The semver range of the peer versions to use for testing.

##### options

###### command

Type: `string`  
Default: `test-main`

The test command to run.

###### npm

Type: `boolean`  
Default: `true`

Run the command as an npm script.

###### bail

Type: `boolean`  
Default: `true`

Immediately end the run when a test fails.

##### callback

*Required*  
Type: `function`
Arguments: `err, results[{version, passed}]`

The callback to call when done. Receives an array of objects with version (`string`) and passed (`integer`) properties.

## License

MIT © [Ben Drucker](http://bendrucker.me)
