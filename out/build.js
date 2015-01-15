(function() {
  var Path, Q, async, browserify, build, coffee, compileCoffee, fs, readPackage;

  coffee = require('coffee-script');

  Q = require('q');

  fs = require('fs');

  async = require('async');

  Path = require('path');

  browserify = require('browserify');

  readPackage = function() {
    return Q.denodeify(fs.readFile)('./package.json', {
      encoding: 'utf8'
    }).then(function(content) {
      return JSON.parse(content);
    });
  };

  compileCoffee = function(content) {
    return coffee.compile(content);
  };

  build = function(source, dest, browser, options, packageJSON) {
    var promises;
    promises = fs.readdirSync(source).filter(function(filename) {
      return Path.extname(filename) === ".coffee";
    }).map(function(filename) {
      return Q.denodeify(fs.readFile)(Path.join(source, filename), {
        encoding: 'utf8'
      }).then(compileCoffee).then(function(result) {
        return Q.denodeify(fs.writeFile)(Path.join(dest, filename.replace('.coffee', '.js')), result);
      });
    });
    return Q.all(promises).then(function() {
      var b, file, _i, _len, _ref;
      b = browserify();
      b.add('./' + Path.join(dest, 'index.js'));
      if (!options.compiler) {
        _ref = packageJSON.mitudomoeCompiler || [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          b.exclude(file);
        }
      }
      return Q.ninvoke(b, 'bundle');
    }).then(function(result) {
      var filename;
      filename = options.compiler ? 'index.compiler.js' : 'index.js';
      return Q.denodeify(fs.writeFile)(Path.join(browser, filename), result);
    });
  };

  readPackage().then(function(packageJSON) {
    return build('./src', './lib', './build', {
      compiler: false
    }, packageJSON).then(packageJSON);
  }).then(function(packageJSON) {
    return build('./src', './lib', './build', {
      compiler: true
    }, packageJSON);
  }).done(function() {
    return console.log('Build finished');
  });

}).call(this);
