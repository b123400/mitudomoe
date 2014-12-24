Path = require 'path'
fs = require 'fs'

class Context
  constructor : (@path)->
  getContent : (filename)->
    fs.readFileSync Path.join(@path, filename), encoding:'utf8'

module.exports = Context