Path = require 'path'
fs = require 'fs'

class Context
  constructor : (@path)->
  getContent : (filename)->
    fs.readFileSync @resolve(filename), encoding:'utf8'
  readDir : (relativePath)->
    fs.readdirSync Path.join(@path, relativePath)
  resolve : (path)->
  	Path.join @path, path

module.exports = Context