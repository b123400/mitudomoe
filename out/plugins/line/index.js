(function() {
  var BaseSyntax, LineController, LineSyntax,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseSyntax = require('mitudomoe/node_modules/functional-parser/syntax/base');

  LineSyntax = (function(_super) {
    __extends(LineSyntax, _super);

    function LineSyntax() {}

    LineSyntax.prototype.lexingStep = function(input) {
      var content, firstLineBreak;
      firstLineBreak = input.indexOf('\n');
      if (firstLineBreak !== -1) {
        content = input.slice(0, +firstLineBreak + 1 || 9e9).slice(0, -1);
        this.yytext = [content, '\n'];
        if (content.length) {
          return ['INLINE', 'LINEBREAK'];
        } else {
          return ['EMPTYLINE', 'LINEBREAK'];
        }
      } else {
        this.yytext = input;
        return 'LASTLINE';
      }
      return false;
    };

    LineSyntax.prototype.grammar = function(bnf) {
      return {
        STATE: [
          this.pattern('LINE', function() {
            return $1;
          })
        ],
        LINE: [
          this.pattern('LASTLINE', function() {
            return {
              text: $1
            };
          }), this.pattern('INLINE LINEBREAK', function() {
            return {
              text: $1
            };
          }), this.pattern('EMPTYLINE LINEBREAK', function() {
            return null;
          })
        ]
      };
    };

    return LineSyntax;

  })(BaseSyntax);

  LineController = (function() {
    function LineController(newState) {
      this.newState = newState;
    }

    LineController.prototype.transit = function() {
      return console.log('transit to', this.newState);
    };

    return LineController;

  })();

  module.exports = {
    name: 'line',
    Syntax: LineSyntax,
    getControllers: function(oldState, newState) {
      if (newState.text) {
        return new LineController(newState);
      }
    }
  };

}).call(this);
