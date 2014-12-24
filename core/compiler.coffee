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
      dependencySyntax = parser.injectDependencySyntax()
      dependencySyntax?.context = context

    return parser.parse content

  connectSyntaxes : -> # do nothing, override me

  injectDependencySyntax : false

class MitudomoeParser extends Parser
  injectDependencySyntax : ->
    try
      index = -1
      DependencySyntax = require('../plugin/dependency')?.Syntax
      try
        CommentSyntax = require('../plugin/comment')?.Syntax
        for syntax, i in @lexer.syntaxes
          if syntax instanceof CommentSyntax
            index = i
            break
      catch e
        syntax = new DependencySyntax
        @lexer.syntaxes.splice index+1, 0, syntax
        return syntax
    catch e
      console.log 'Cannot find dependency syntax, ignored.', e

module.exports = MitudomoeCompiler