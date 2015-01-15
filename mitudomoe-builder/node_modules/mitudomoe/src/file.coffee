fs = require 'fs'
Q = require 'q'

getStates = (filename)->
  Q.denodeify(fs.readFile)(filename)
    .then (content)-> JSON.parse content

class Generator
  constructor : (@filename)->
    @currentLine = -1
    @states = getStates @filename
    @ended = false

  next : ->
    @states.then (s)=>
      @currentLine++
      if @currentLine >= s.length-1
        @ended = true
      s[@currentLine]

module.exports = {Generator}