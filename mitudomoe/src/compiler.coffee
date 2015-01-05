Mitudomoe = require './mitudomoe'
{Parser} = require 'functional-parser/parser'

class MitudomoeCompiler extends Mitudomoe
  constructor : ->
    super

  use : (plugin)->
    super

  compile : (content, context)->
    parser = new MitudomoeParser

    syntaxes = {}
    for p in @plugins
      syntax = new p.Syntax
      syntaxes[p.name] = syntax
      parser.addSyntax syntax
    
    @connectSyntaxes syntaxes
    
    if @injectDependencySyntax
      dependencySyntax = parser.injectDependencySyntax @getPlugin.bind @
      dependencySyntax?.context = context

    return parser.parse content

  connectSyntaxes : -> # do nothing, override me

  injectDependencySyntax : false

class MitudomoeParser extends Parser
  injectDependencySyntax : (getPlugin)->
    index = -1
    DependencySyntax = getPlugin('dependency')?.Syntax
    if not DependencySyntax
      return console.log 'Cannot find dependency syntax, ignored.'
    CommentSyntax = getPlugin('comment')?.Syntax
    if CommentSyntax
      for syntax, i in @lexer.syntaxes
        if syntax instanceof CommentSyntax
          index = i
          break
    syntax = new DependencySyntax
    @lexer.syntaxes.splice index+1, 0, syntax
    @addSyntax syntax
    return syntax
      

MitudomoeCompiler.Parser = MitudomoeParser

module.exports = MitudomoeCompiler