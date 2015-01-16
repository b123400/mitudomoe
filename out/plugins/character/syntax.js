(function() {
  var BaseSyntax, CharacterSyntax,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  BaseSyntax = require('mitudomoe/node_modules/functional-parser/syntax/base');

  CharacterSyntax = (function(_super) {
    __extends(CharacterSyntax, _super);

    CharacterSyntax.prototype.colonRegex = /[\s]*:[\s]*/;

    function CharacterSyntax(characters) {
      this.characters = characters != null ? characters : [];
      CharacterSyntax.__super__.constructor.apply(this, arguments);
    }

    CharacterSyntax.prototype.addCharacter = function(name) {
      if (__indexOf.call(this.characters, name) < 0) {
        return this.characters.push(name);
      }
    };

    CharacterSyntax.prototype.lexingStep = function(input) {
      var characterName, nextColon, result, _i, _len, _ref;
      _ref = this.characters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        characterName = _ref[_i];
        if (input.substr(0, characterName.length) === characterName) {
          this.yytext = [characterName];
          result = ['CHARACTER_NAME'];
          nextColon = this.colonRegex.exec(input.slice(characterName.length));
          if ((nextColon != null ? nextColon.index : void 0) === 0) {
            this.yytext.push(nextColon[0]);
            result.push(':');
          }
          return result;
        }
      }
      return false;
    };

    CharacterSyntax.prototype.grammar = function() {
      return {
        STATE: [
          this.pattern("CHARACTER : LINE", function() {
            var characterName, obj;
            characterName = $1.name;
            obj = {};
            obj[characterName] = {
              speech: $3.text
            };
            return {
              characterModifier: obj
            };
          })
        ],
        "CHARACTER": [
          this.pattern("CHARACTER_NAME", function() {
            return {
              name: $1
            };
          })
        ]
      };
    };

    CharacterSyntax.prototype.applySetting = function() {
      return (function(_this) {
        return function(key, values) {
          var v, _i, _len, _results;
          if (key.toLowerCase() !== 'characters') {
            return;
          }
          _results = [];
          for (_i = 0, _len = values.length; _i < _len; _i++) {
            v = values[_i];
            _results.push(_this.addCharacter(v));
          }
          return _results;
        };
      })(this);
    };

    return CharacterSyntax;

  })(BaseSyntax);

  module.exports = CharacterSyntax;

}).call(this);
