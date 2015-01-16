BaseSyntax = require 'mitudomoe/node_modules/functional-parser/syntax/base'

class LineSyntax extends BaseSyntax
  constructor : ->
  lexingStep : (input)->
    firstLineBreak = input.indexOf '\n'
    if firstLineBreak isnt -1
      content = input[..firstLineBreak][..-2]
      @yytext = [content,'\n']
      if content.length
        return ['INLINE', 'LINEBREAK']
      else
        return ['EMPTYLINE', 'LINEBREAK']
    else
      @yytext = input
      return 'LASTLINE'
    return false

  grammar : (bnf)->
    STATE : [
      @pattern 'LINE', -> $1
    ]

    LINE : [
      @pattern 'LASTLINE', -> {text : $1}
      @pattern 'INLINE LINEBREAK', -> {text: $1}
      @pattern 'EMPTYLINE LINEBREAK', -> null
    ]

class LineController
  constructor : (@newState)->
  transit : ->
    console.log 'transit to', @newState

module.exports = {
  name : 'line'
  Syntax : LineSyntax
  getControllers : (oldState, newState)->
    return new LineController newState if newState.text
}