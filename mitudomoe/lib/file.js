(function() {
  var Generator, Q, fs, getStates;

  fs = require('fs');

  Q = require('q');

  getStates = function(filename) {
    return Q.denodeify(fs.readFile)(filename).then(function(content) {
      return JSON.parse(content);
    });
  };

  Generator = (function() {
    function Generator(filename) {
      this.filename = filename;
      this.currentLine = -1;
      this.states = getStates(this.filename);
      this.ended = false;
    }

    Generator.prototype.next = function() {
      return this.states.then((function(_this) {
        return function(s) {
          _this.currentLine++;
          if (_this.currentLine >= s.length - 1) {
            _this.ended = true;
          }
          return s[_this.currentLine];
        };
      })(this));
    };

    return Generator;

  })();

  module.exports = {
    Generator: Generator
  };

}).call(this);
