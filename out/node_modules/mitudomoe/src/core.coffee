Q = require 'q'
utility = require './utility'
Path = require 'path'

class Core
  constructor : ->
    @currentState = {}
    @plugins = []
    @generator = null
    @transiting = false

  addPlugin : (name)->
    @use require name

  use : (plugin)->
    @plugins.push plugin if plugin not in @plugins

  getPlugin : (pluginName)->
    return p for p in @plugins when p.name is pluginName

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

module.exports = Core