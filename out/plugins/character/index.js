(function() {
  var AutoImportedCharacters, Character, CharacterController, CharacterPlugin, CharacterSyntax, Context, diffCharacters, findControllerForName, path, preBuild, utility, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('mitudomoe'), Context = _ref.Context, utility = _ref.utility;

  preBuild = (function() {
    try {
      return require('./build');
    } catch (_error) {}
  })().preBuild;

  path = require('path');

  CharacterSyntax = (function() {
    try {
      return require('./syntax');
    } catch (_error) {}
  })();

  AutoImportedCharacters = (function() {
    try {
      return require('./autoadd');
    } catch (_error) {}
  })();


  /*
   * state keys: characters, characterModifier
   *
   * characters : ['aaa','bbb','ccc'] identifier of characters
   *
   * characterModifier : {
   *   <identifier> : { speech : ..., emotion: ... }
   * }
   */

  CharacterController = (function() {
    function CharacterController(character, oldState, newState) {
      this.character = character;
      this.oldState = oldState != null ? oldState : {};
      this.newState = newState != null ? newState : {};
    }

    CharacterController.prototype.transit = function() {};

    return CharacterController;

  })();

  Character = (function() {
    function Character() {}

    Character.prototype.getController = function() {
      return new CharacterController(this);
    };

    return Character;

  })();

  CharacterPlugin = (function() {
    function CharacterPlugin() {}

    CharacterPlugin.characters = [];

    CharacterPlugin.find = function(name) {
      var c, _i, _len, _ref1;
      _ref1 = this.characters;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        if (__indexOf.call(c.names, name) >= 0) {
          return c;
        }
      }
    };

    CharacterPlugin.add = function(character) {
      if (__indexOf.call(this.characters, character) < 0) {
        return this.characters.push(character);
      }
    };

    CharacterPlugin.autoAdd = function(context) {
      var file, files, _i, _len, _results;
      files = context.readDir('characters').filter(function(f) {
        return path.extname(f) === '.js';
      });
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.add(require(context.resolve('characters/' + file))));
      }
      return _results;
    };

    return CharacterPlugin;

  })();


  /*
   * @return identifiers of character
   */

  diffCharacters = function(oldState, newState) {
    var diff;
    diff = utility.diffArray(oldState.characters, newState.characters, {
      flat: true
    });
    return diff.added.concat(diff.removed).concat(Object.keys(newState.characterModifier || {})).filter(function(v, i, self) {
      return i === self.indexOf(v);
    });
  };

  findControllerForName = function(name, oldState, newState) {
    var _ref1, _ref2, _ref3;
    oldState = (_ref1 = oldState.characterModifier) != null ? _ref1[name] : void 0;
    newState = (_ref2 = newState.characterModifier) != null ? _ref2[name] : void 0;
    return (_ref3 = CharacterPlugin.find(name)) != null ? typeof _ref3.getController === "function" ? _ref3.getController(oldState, newState) : void 0 : void 0;
  };

  module.exports = {
    name: 'character',
    Syntax: CharacterSyntax,
    preBuild: preBuild,
    CharacterController: CharacterController,
    Character: Character,
    getControllers: function(oldState, newState) {
      var id, _i, _len, _ref1, _results;
      _ref1 = diffCharacters(oldState, newState);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        id = _ref1[_i];
        _results.push(findControllerForName(id, oldState, newState));
      }
      return _results;
    },
    transit: function(oldState, newState, delta) {
      if (oldState.characterName !== newState.characterName) {
        return character.setCurrentCharacter(newState.character);
      }
    }
  };

}).call(this);
