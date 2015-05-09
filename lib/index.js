'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _majorVersions = require('major-versions');

var _majorVersions2 = _interopRequireDefault(_majorVersions);

var _ensureArray = require('ensure-array');

var _ensureArray2 = _interopRequireDefault(_ensureArray);

var _npm = require('npm');

var _npm2 = _interopRequireDefault(_npm);

var _spawnNpmInstall = require('spawn-npm-install');

var _spawnNpmInstall2 = _interopRequireDefault(_spawnNpmInstall);

var _bluebird = require('bluebird');

var _path = require('path');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _ap = require('ap');

var _events = require('events');

var _defaults = require('defaults');

var _defaults2 = _interopRequireDefault(_defaults);

'use strict';

_bluebird.promisifyAll(_spawnNpmInstall2['default']);

var Runner = (function (_EventEmitter) {
  function Runner(name, range) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Runner);

    _get(Object.getPrototypeOf(Runner.prototype), 'constructor', this).call(this);
    _assert2['default'](name, 'Peer name must be defined');
    _assert2['default'](range, 'Peer range must be defined');
    _defaults2['default'](options, {
      script: 'test-main',
      bail: true
    });
    _extends(this, { name: name, range: range, options: options });
  }

  _inherits(Runner, _EventEmitter);

  _createClass(Runner, [{
    key: 'versions',
    value: function versions() {
      var _this2 = this;

      return _bluebird.promisify(_npm2['default'].commands.view)([this.name, 'dist-tags.latest'], true).then(function (v) {
        return _majorVersions2['default'](_this2.range, v);
      }).tap(function (versions) {
        return _this2.emit('versions', versions);
      });
    }
  }, {
    key: 'install',
    value: function install() {
      var _this3 = this;

      var version = arguments[0] === undefined ? '' : arguments[0];

      this.emit('preinstall', version);
      return _spawnNpmInstall2['default'].installAsync(['' + this.name + '@' + version], {
        stdio: 'inherit'
      }).then(function () {
        return _this3.emit('postinstall', version);
      })['return'](version);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(version) {
      var _this4 = this;

      this.emit('preuninstall', version);
      return _bluebird.promisify(_npm2['default'].commands.uninstall)(this.name).then(function () {
        return _this4.emit('postuninstall', version);
      });
    }
  }, {
    key: 'runScript',
    value: function runScript(version) {
      var _this5 = this;

      this.emit('prescript', version);
      return _bluebird.promisify(_npm2['default'].commands.runScript)([this.options.script]).reflect().tap(function () {
        return _this5.emit('postscript', version);
      }).then(function (promise) {
        var result = {
          passed: promise.isFulfilled(),
          version: version
        };
        _this5.emit('result', result);
        if (_this5.options.bail && !result.passed) {
          throw promise.reason();
        }
        return result;
      });
    }
  }, {
    key: 'test',
    value: function test(version) {
      var _this6 = this;

      return this.install(version).bind(this).then(this.runScript).tap(function () {
        return _this6.uninstall(version);
      });
    }
  }, {
    key: 'run',
    value: function run() {
      var _this7 = this;

      return load().bind(this).then(this.versions).reduce(function (results, version) {
        return _this7.test(version).bind(results).then(results.concat);
      }, []).tap(function () {
        return _this7.install();
      });
    }
  }]);

  return Runner;
})(_events.EventEmitter);

exports.Runner = Runner;

function load() {
  return _bluebird.promisify(_npm2['default'].load)();
}