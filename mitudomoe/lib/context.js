(function() {
  var Context, Path, fs;

  Path = require('path');

  fs = require('fs');

  Context = (function() {
    function Context(path) {
      this.path = path;
    }

    Context.prototype.getContent = function(filename) {
      return fs.readFileSync(this.resolve(filename), {
        encoding: 'utf8'
      });
    };

    Context.prototype.readDir = function(relativePath) {
      return fs.readdirSync(Path.join(this.path, relativePath));
    };

    Context.prototype.resolve = function(path) {
      return Path.join(this.path, path);
    };

    return Context;

  })();

  module.exports = Context;

}).call(this);
