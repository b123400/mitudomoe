Q = require 'q'

class Mitudomoe
  constructor : ->
    @currentState = {}
    @plugins = []
    @generator = null
    @transiting = false

  use : (plugin)->
    @plugins.push plugin if plugin not in @plugins

  setState : (newState)->
    controllers = (p.getControllers?(@currentState, newState) for p in @plugins)
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

module.exports = Mitudomoe