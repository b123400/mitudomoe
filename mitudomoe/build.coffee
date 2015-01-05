coffee = require 'coffee-script'
# preprocess = require 'preprocess'
Q = require 'q'
fs = require 'fs'
async = require 'async'
Path = require 'path'
browserify = require 'browserify'

readPackage = ->
  return Q.denodeify(fs.readFile)('./package.json',{encoding:'utf8'})
    .then (content)-> JSON.parse content

# preprocessFile = (options)->
#   (content)-> preprocess.preprocess content, options, 'coffee'

compileCoffee = (content)->
  coffee.compile content

build = (source, dest, browser, options, packageJSON)->
  promises = fs.readdirSync(source)
  .filter (filename) ->
     Path.extname(filename) is ".coffee"
  .map (filename)->
    Q
    .denodeify(fs.readFile)(Path.join(source,filename), {encoding:'utf8'} )
    # .then(preprocessFile(options))
    .then(compileCoffee)
    .then (result)->
      Q.denodeify(fs.writeFile)(Path.join(dest,filename.replace('.coffee','.js')), result);

  Q.all(promises)
    .then ->
      b = browserify()
      b.add('./'+Path.join(dest,'index.js'))
      if !options.compiler
        b.exclude file for file in (packageJSON.mitudomoeCompiler || [])
      Q.ninvoke(b, 'bundle')
    .then (result)->
      filename = if options.compiler then 'index.compiler.js' else 'index.js'
      Q.denodeify(fs.writeFile)(Path.join(browser, filename), result)

readPackage()
.then (packageJSON)->
  build('./src','./lib','./build',{compiler:false}, packageJSON)
  .then packageJSON
.then (packageJSON)->
  build('./src','./lib','./build',{compiler:true}, packageJSON)
.done -> console.log('Build finished')