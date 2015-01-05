BaseSyntax = require 'functional-parser/syntax/base'
RegexSyntax = require 'functional-parser/syntax/regex'
{Lexer} = require 'functional-parser/parser'
{Parser} = require '../core/compiler'
Mitudomoe = require '../core/mitudomoe'

class DependencySyntax extends BaseSyntax
  openRegex : /#import\s*/
  filenameRegex : /[^\s\n]+/
  constructor : ->
    super
    @context = null
    @subLexer = new Lexer
    @importStack = []
    @subLexer.addSyntax new RegexSyntax @openRegex, -> 'IMPORT_MARK'
    @subLexer.addSyntax new RegexSyntax @filenameRegex, -> 'IMPORT_FILE'

  lexingStep : (input)->
    @subLexer.setInput input
    
    first = @subLexer.lex()
    return false if first isnt 'IMPORT_MARK'
    firstText = @subLexer.yytext

    second = @subLexer.lex()
    return false if second isnt 'IMPORT_FILE'
    secondText = @subLexer.yytext

    @yytext = [firstText, secondText]

    return [first, second]

  grammar : (bnf)->
    STATE : [
      @pattern 'IMPORTED_STATE', -> $1
    ]

    IMPORTED_STATE : [
      @pattern 'IMPORT_MARK IMPORT_FILE', -> yy.importFile $2
    ]

  bridge : ->
    importFile : (filename)=>

      if filename in @importStack
        circularText = @importStack.join(' --> ') + ' --> '+ filename
        throw "Circular import is not supported #{circularText}"
      @importStack.push filename

      content = @context?.getContent filename
      lexer = @lexer
      parser = new Parser
      
      parser.addSyntax syntax for syntax in lexer.syntaxes
      states = parser.parse content

      @importStack.pop()

      state = Mitudomoe.mergeStates states
      syntax.lexer = lexer for syntax in lexer.syntaxes

      return state

module.exports = {
  Syntax : DependencySyntax
}