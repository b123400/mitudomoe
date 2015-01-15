BaseSyntax = require 'functional-parser/syntax/base'
RegexSyntax = require 'functional-parser/syntax/regex'
{Lexer} = require 'functional-parser/parser'

class SettingSyntax extends BaseSyntax
  regex:
    dash : /[\s]*-+[\s]*/
    string : /[^:\s,]+/
    # key : /([^:\s]+)\s*:/
    # value : /(.+?)\s*-+/
    comma : /[\s]*,[\s]*/
    colonRegex : /[\s]*:[\s]*/

  constructor : ->
    super
    @callbacks = []
    @dashSyntax = new RegexSyntax @regex.dash, -> '-'
    @stringSyntax = new RegexSyntax @regex.string, -> 'SETTING_STRING'
    @commaSyntax = new RegexSyntax @regex.comma, -> ','
    @colonSyntax = new RegexSyntax @regex.colonRegex, -> ':'

    @subLexer = new Lexer
    @subLexer.addSyntax s for s in [@dashSyntax, @colonSyntax, @commaSyntax, @stringSyntax]

  lexingStep : (input)->
    @subLexer.setInput input

    results = []
    yytexts = []
    i = 0
    dashCount = 0
    while lexed = @subLexer.lex()

      break if lexed is 'INVALID' or lexed is 'EOF'

      results.push lexed
      yytexts.push @subLexer.yytext

      dashCount++ if lexed is '-'
      break if dashCount is 2
      i++

    return false if results.length is 0
    [open, key, colon, middle..., close] = results
    return false if open isnt '-' or 
      close isnt '-' or 
      colon isnt ':' or
      key isnt 'SETTING_STRING'
    values = []
    for value, i in middle
      if i%2 == 0
        return false if value isnt 'SETTING_STRING'
        values.push yytexts[i+3]
      else
        return false if value isnt ','

    cb yytexts[1], values for cb in @callbacks
    @yytext = yytexts
    return results

  grammar : (bnf)->
    STATE : [
      @pattern "SETTING", -> $1
    ]

    SETTING : [
      @pattern "- SETTING_KEY : SETTING_VALUE -", ->
        obj={}
        key=$2
        obj[key]=$4
        yy.receivedSetting $2, $4
        return obj
    ]

    SETTING_KEY : [
      @pattern "SETTING_STRING", -> $1
    ]

    SETTING_VALUE : [
      @pattern "SETTING_STRING", -> [$1]
      @pattern "SETTING_VALUE , SETTING_STRING", -> $1.concat $3
    ]

  addDelegate : (cb)->
    throw 'callback is not a function' if cb not instanceof Function
    @callbacks.push cb

  bridge : ->
    receivedSetting : (key, values)=>
      # cb key, values for cb in @callbacks

module.exports = {
  name : 'setting'
  Syntax : SettingSyntax
}