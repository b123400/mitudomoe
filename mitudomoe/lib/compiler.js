// Generated by CoffeeScript 1.8.0
(function() {
  var Mitudomoe, MitudomoeCompiler, MitudomoeParser, Parser, Path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mitudomoe = require('./core');

  Parser = require('functional-parser/parser').Parser;

  Path = require('path');

  MitudomoeCompiler = (function(_super) {
    __extends(MitudomoeCompiler, _super);

    function MitudomoeCompiler() {
      this.pluginFolders = [];
      MitudomoeCompiler.__super__.constructor.apply(this, arguments);
    }

    MitudomoeCompiler.prototype.addPlugin = function(name) {
      var pluginFolder;
      pluginFolder = Path.resolve(__dirname, '..', '..', '..', 'plugins', name);
      this.pluginFolders.push(pluginFolder);
      return MitudomoeCompiler.__super__.addPlugin.call(this, pluginFolder);
    };

    MitudomoeCompiler.prototype.compile = function(content, context) {
      var dependencySyntax, p, parser, syntax, syntaxes, _i, _len, _ref;
      parser = new MitudomoeParser;
      syntaxes = {};
      _ref = this.plugins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        syntax = new p.Syntax;
        syntaxes[p.name] = syntax;
        parser.addSyntax(syntax);
      }
      this.connectSyntaxes(syntaxes);
      if (this.injectDependencySyntax) {
        dependencySyntax = parser.injectDependencySyntax(this.getPlugin.bind(this));
        if (dependencySyntax != null) {
          dependencySyntax.context = context;
        }
      }
      return parser.parse(content);
    };

    MitudomoeCompiler.prototype.connectSyntaxes = function() {};

    MitudomoeCompiler.prototype.injectDependencySyntax = false;

    MitudomoeCompiler.prototype.preBuild = function(context) {
      var content, p, path, relative;
      relative = function(p) {
        return Path.relative(context.path, p);
      };
      path = Path.resolve(__dirname, 'plugins.js');
      content = "module.exports={";
      content += ((function() {
        var _i, _len, _ref, _results;
        _ref = this.pluginFolders;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push("require('" + (relative(p)) + "')");
        }
        return _results;
      }).call(this)).join(',');
      content += "};";
      console.log('writing ', content, 'to', path);
      return context.write(path, content);
    };

    return MitudomoeCompiler;

  })(Mitudomoe);

  MitudomoeParser = (function(_super) {
    __extends(MitudomoeParser, _super);

    function MitudomoeParser() {
      return MitudomoeParser.__super__.constructor.apply(this, arguments);
    }

    MitudomoeParser.prototype.injectDependencySyntax = function(getPlugin) {
      var CommentSyntax, DependencySyntax, i, index, syntax, _i, _len, _ref, _ref1, _ref2;
      index = -1;
      DependencySyntax = (_ref = getPlugin('dependency')) != null ? _ref.Syntax : void 0;
      if (!DependencySyntax) {
        return console.log('Cannot find dependency syntax, ignored.');
      }
      CommentSyntax = (_ref1 = getPlugin('comment')) != null ? _ref1.Syntax : void 0;
      if (CommentSyntax) {
        _ref2 = this.lexer.syntaxes;
        for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
          syntax = _ref2[i];
          if (syntax instanceof CommentSyntax) {
            index = i;
            break;
          }
        }
      }
      syntax = new DependencySyntax;
      this.lexer.syntaxes.splice(index + 1, 0, syntax);
      this.addSyntax(syntax);
      return syntax;
    };

    return MitudomoeParser;

  })(Parser);

  MitudomoeCompiler.Parser = MitudomoeParser;

  module.exports = MitudomoeCompiler;

}).call(this);
