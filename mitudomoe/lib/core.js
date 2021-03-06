// Generated by CoffeeScript 1.8.0
(function() {
  var Core, Path, Q, utility,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Q = require('q');

  utility = require('./utility');

  Path = require('path');

  Core = (function() {
    function Core() {
      this.currentState = {};
      this.plugins = [];
      this.generator = null;
      this.transiting = false;
    }

    Core.prototype.addPlugin = function(name) {
      return this.use(require(name));
    };

    Core.prototype.use = function(plugin) {
      if (__indexOf.call(this.plugins, plugin) < 0) {
        return this.plugins.push(plugin);
      }
    };

    Core.prototype.getPlugin = function(pluginName) {
      var p, _i, _len, _ref;
      _ref = this.plugins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.name === pluginName) {
          return p;
        }
      }
    };

    Core.prototype.setState = function(newState) {
      var controllers, promises;
      controllers = this.plugins.map((function(_this) {
        return function(p) {
          return typeof p.getControllers === "function" ? p.getControllers(_this.currentState, newState) : void 0;
        };
      })(this)).reduce((function(l, t) {
        return l.concat(t);
      }), []).filter(function(x) {
        return x !== void 0;
      });
      promises = controllers.map(function(c) {
        return c.transit();
      });
      this.transiting = true;
      return Q.all(promises).done((function(_this) {
        return function() {
          _this.transiting = false;
          return _this.next();
        };
      })(this));
    };

    Core.prototype.setInput = function(generator) {
      var isInitial;
      isInitial = !this.generator;
      this.generator = generator;
      if (isInitial) {
        return this.next();
      }
    };

    Core.prototype.next = function() {
      if (!this.generator || this.generator.ended) {
        return;
      }
      return Q(this.generator.next()).then((function(_this) {
        return function(s) {
          return _this.setState(s);
        };
      })(this));
    };

    Core.mergeStates = function(states) {
      return states.reduce(utility.mergeState, {});
    };

    return Core;

  })();

  module.exports = Core;

}).call(this);
