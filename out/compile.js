(function() {
  var Compiler, Context, File, Glob, Path, Q, app, compileApplication, compileScenario, configure, fs, setupHTML, _ref;

  _ref = require('mitudomoe'), Compiler = _ref.Compiler, Context = _ref.Context;

  configure = require('./configure');

  Q = require('q');

  fs = require('fs');

  Path = require('path');

  Glob = require('glob');

  File = require('file');

  app = new Compiler;

  configure(app);

  app.connectSyntaxes = function(syntaxes) {
    var character, setting;
    setting = syntaxes.setting, character = syntaxes.character;
    return setting != null ? setting.addDelegate(character.applySetting()) : void 0;
  };

  app.injectDependencySyntax = true;

  compileScenario = function(inputFolder, outputFolder) {
    var map, read, searchFile, write;
    read = Q.denodeify(fs.readFile);
    write = Q.denodeify(fs.writeFile);
    map = function(fn) {
      return function(arr) {
        var obj;
        return Q.all((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            obj = arr[_i];
            _results.push(fn(obj));
          }
          return _results;
        })());
      };
    };
    searchFile = function(folderPath) {
      return Q.denodeify(Glob)(Path.join(folderPath, '*.scene'));
    };
    return searchFile(inputFolder).then(function(files) {
      console.log('Compile scenario:', files);
      return files;
    }).then(map(function(path) {
      var context, dir;
      dir = Path.dirname(path);
      context = new Context(dir);
      return read(path, {
        encoding: 'utf8'
      }).then(function(content) {
        return {
          path: path,
          compiled: app.compile(content, context)
        };
      }).then(function(_arg) {
        var compiled, path, relative, resolved;
        path = _arg.path, compiled = _arg.compiled;
        relative = Path.relative(inputFolder, path);
        resolved = Path.resolve(outputFolder, relative);
        dir = Path.dirname(resolved);
        File.mkdirsSync(dir);
        return write(resolved, JSON.stringify(compiled));
      });
    }));
  };

  compileApplication = function() {};

  setupHTML = function() {};

  Q.all([compileScenario('./scenario', './output'), compileApplication('./output/mitudomoe.js')]).then(function(scenarioFiles, applicationFile) {
    return setupHTML(scenarioFiles, applicationFile);
  }).done(function() {
    return console.log('Finished');
  });

}).call(this);
