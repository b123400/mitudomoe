// Generated by CoffeeScript 1.8.0
var BaseSyntax, Lexer, RegexSyntax, SettingSyntax,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

BaseSyntax = require('functional-parser/syntax/base');

RegexSyntax = require('functional-parser/syntax/regex');

Lexer = require('functional-parser/parser').Lexer;

SettingSyntax = (function(_super) {
  __extends(SettingSyntax, _super);

  SettingSyntax.prototype.regex = {
    dash: /[\s]*-+[\s]*/,
    string: /[^:\s,]+/,
    comma: /[\s]*,[\s]*/,
    colonRegex: /[\s]*:[\s]*/
  };

  function SettingSyntax() {
    var s, _i, _len, _ref;
    SettingSyntax.__super__.constructor.apply(this, arguments);
    this.callbacks = [];
    this.dashSyntax = new RegexSyntax(this.regex.dash, function() {
      return '-';
    });
    this.stringSyntax = new RegexSyntax(this.regex.string, function() {
      return 'SETTING_STRING';
    });
    this.commaSyntax = new RegexSyntax(this.regex.comma, function() {
      return ',';
    });
    this.colonSyntax = new RegexSyntax(this.regex.colonRegex, function() {
      return ':';
    });
    this.subLexer = new Lexer;
    _ref = [this.dashSyntax, this.colonSyntax, this.commaSyntax, this.stringSyntax];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      this.subLexer.addSyntax(s);
    }
  }

  SettingSyntax.prototype.lexingStep = function(input) {
    var cb, close, colon, dashCount, i, key, lexed, middle, open, results, value, values, yytexts, _i, _j, _k, _len, _len1, _ref;
    this.subLexer.setInput(input);
    results = [];
    yytexts = [];
    i = 0;
    dashCount = 0;
    while (lexed = this.subLexer.lex()) {
      if (lexed === 'INVALID' || lexed === 'EOF') {
        break;
      }
      results.push(lexed);
      yytexts.push(this.subLexer.yytext);
      if (lexed === '-') {
        dashCount++;
      }
      if (dashCount === 2) {
        break;
      }
      i++;
    }
    if (results.length === 0) {
      return false;
    }
    open = results[0], key = results[1], colon = results[2], middle = 5 <= results.length ? __slice.call(results, 3, _i = results.length - 1) : (_i = 3, []), close = results[_i++];
    if (open !== '-' || close !== '-' || colon !== ':' || key !== 'SETTING_STRING') {
      return false;
    }
    values = [];
    for (i = _j = 0, _len = middle.length; _j < _len; i = ++_j) {
      value = middle[i];
      if (i % 2 === 0) {
        if (value !== 'SETTING_STRING') {
          return false;
        }
        values.push(yytexts[i + 3]);
      } else {
        if (value !== ',') {
          return false;
        }
      }
    }
    _ref = this.callbacks;
    for (_k = 0, _len1 = _ref.length; _k < _len1; _k++) {
      cb = _ref[_k];
      cb(yytexts[1], values);
    }
    this.yytext = yytexts;
    return results;
  };

  SettingSyntax.prototype.grammar = function(bnf) {
    return {
      STATE: [
        this.pattern("SETTING", function() {
          return $1;
        })
      ],
      SETTING: [
        this.pattern("- SETTING_KEY : SETTING_VALUE -", function() {
          var key, obj;
          obj = {};
          key = $2;
          obj[key] = $4;
          yy.receivedSetting($2, $4);
          return obj;
        })
      ],
      SETTING_KEY: [
        this.pattern("SETTING_STRING", function() {
          return $1;
        })
      ],
      SETTING_VALUE: [
        this.pattern("SETTING_STRING", function() {
          return [$1];
        }), this.pattern("SETTING_VALUE , SETTING_STRING", function() {
          return $1.concat($3);
        })
      ]
    };
  };

  SettingSyntax.prototype.addDelegate = function(cb) {
    if (!(cb instanceof Function)) {
      throw 'callback is not a function';
    }
    return this.callbacks.push(cb);
  };

  SettingSyntax.prototype.bridge = function() {
    return {
      receivedSetting: (function(_this) {
        return function(key, values) {};
      })(this)
    };
  };

  return SettingSyntax;

})(BaseSyntax);

module.exports = {
  name: 'setting',
  Syntax: SettingSyntax
};
