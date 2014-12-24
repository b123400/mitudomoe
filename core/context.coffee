Path = require 'path'

class Context
  constructor : (@path)->
  getContent : (filename)->
    Path.join @path, filename

module.exports = Context