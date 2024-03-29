# test-peer-range

> Test a package against the full range of major supported versions of a peer dependency

## Install

```
npm install --save-dev test-peer-range
```

## Usage

```sh
test-peer-range browserify
```

In `package.json`:

```json
{
  "name": "transformify",
  "description": "A browserify transform",
  "scripts": {
    "test": "test-peer-range browserify",
    "test-main": "node test.js"
  },
  "devDependencies": {
    "browserify": "16",
    "test-peer-range": "*"
  },
  "peerDependencies": {
    "browserify": ">= 14"
  }
}
```

The program will execute `test-main` for each major version (e.g. 14, 15, 16) of the peer. This is useful for maintaining backward compatibility for plugins. As long as the peer dependency follows [semver](https://semver.org/), you can be confident that your code works on old versions while developing against a more recent line.

Arguments are passed through, so running `npm test -- --inspect` would result in `node test.js --inspect` as your test command.

## CLI

#### `test-peer-range <name>`

##### name

*Required*  
Type: `string`

The package name of the peer.

##### --versions

Type: `array[string]`  
Alias: `-v`  
Default: `test-main`

Additional versions to test, on top of major versions specified in `peerDependencies`. Repeat this flag to specify multiple versions, e.g. `-v 1.2.3 -v 4.5.6`.

##### --command

Type: `string`  
Alias: `-c`  
Default: `test-main`

A command to run for each version. By default this is expected to be an npm script.

##### --npm

Type: `boolean`  
Default: `true`

Disable npm to run the `--command` directly.

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

###### arguments

Type: `array[string]`  
Default: `[]`

Additional command line arguments to pass to the command. For npm scripts, these will be passed to the script itself, not `npm run`.

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
