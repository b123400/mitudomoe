Q = require 'q'
utility = require '../core/utility'

class Mitudomoe
  constructor : ->
    @currentState = {}
    @plugins = []
    @generator = null
    @transiting = false

  use : (plugin)->
    @plugins.push plugin if plugin not in @plugins

  setState : (newState)->
    controllers = @plugins
      .map (p)=> p.getControllers? @currentState, newState
      .reduce ((l,t)-> l.concat t), [] #flatten array
      .filter (x)-> x isnt undefined

    promises = controllers.map (c)-> c.transit()
    @transiting = true
    Q.all(promises).done =>
      @transiting = false
      @next()

  setInput : (generator)->
    isInitial = not @generator
    @generator = generator
    @next() if isInitial

  next : ->
    return if not @generator or @generator.ended
    Q(@generator.next()).then (s)=>
      @setState s

  @mergeStates : (states)->
    states.reduce utility.mergeState, {}

module.exports = Mitudomoe