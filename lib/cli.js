'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _ = require('../');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _dotProp = require('dot-prop');

var _dotProp2 = _interopRequireDefault(_dotProp);

var _path = require('path');

var _clout = require('clout');

'use strict';

var cwd = process.cwd;

var pkg = require(_path.resolve(cwd(), 'package.json'));
var log = _clout.createLogger('test-peer-range');

var _yargs$demand$option = _yargs2['default'].demand(1).option('script', {
  'default': 'test-main',
  describe: 'test script'
});

var argv = _yargs$demand$option.argv;

var _argv$_ = _slicedToArray(argv._, 1);

var peer = _argv$_[0];
var script = argv.script;
var verbose = argv.verbose;

var range = _dotProp2['default'].get(pkg, 'peerDependencies.' + peer);

new _.Runner(peer, range, { script: script }).on('versions', function (versions) {
  log('Testing ' + peer + ' versions ' + versions.join(', '));
}).on('preinstall', function (version) {
  log('Installing ' + peer + '@' + version);
}).on('postinstall', function (version) {
  log('Installed ' + peer + '@' + version);
}).on('prescript', function (version) {
  log('Starting "' + script + '" for ' + peer + '@' + version);
}).on('result', function (_ref) {
  var passed = _ref.passed;
  var version = _ref.version;

  var outcome = passed ? 'Passed' : 'Failed';
  log('' + outcome + ': ' + peer + '@' + version);
}).run()['catch'](fail);

function fail(err) {
  log.error(err);
  console.error(err.stack);
  process.exit(1);
}