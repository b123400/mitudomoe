Path = require 'path'
fs = require 'fs'
Q = require 'q'
fsx = require 'fs-extra'

class Context
  constructor : (@path)->

  getContent : (filename, options={encoding:'utf8'})->
    read = Q.denodeify fs.readFile
    read @resolve(filename), options

  readDir : (relativePath)->
    read = Q.denodeify fs.readdir
    read @resolve relativePath

  stat : (path)->
    path = @resolve path
    Q.denodeify(fs.stat)(path)

  write : (path, content)->
    write = Q.denodeify fsx.outputFile
    write @resolve(path), content

  copy : (inPath, outPath)->
    copy = Q.denodeify fsx.copy
    @remove outPath
    .then =>
      copy @resolve(inPath), @resolve(outPath)

  remove : (path)->
    remove = Q.denodeify fsx.remove.bind fs
    remove path

  resolve : (path...)->
    Path.resolve @path, path...

  join : (path...)->
    Path.join @path, path...

  relative : (path)->
    Path.relative @path, path

  subContext : (subPath...)->
    newPath = @resolve subPath...
    new @constructor newPath

module.exports = Context