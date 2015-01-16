{Compiler, Context} = require 'mitudomoe'
configure = require './configure'
Q = require 'q'
fs = require 'fs'
Path = require 'path'
Glob = require 'glob'
File = require 'file'

app = new Compiler
configure app

app.connectSyntaxes = (syntaxes)->
  {setting, character} = syntaxes
  setting?.addDelegate character.applySetting()

# getScenarioFiles = (path)->
#   files = fs.readdirSync normalizedPath # fix it later, recursive
#   files.map (filename)-> Path.join __dirname, 'scenario', filename

# getOutputPath = (path)->
#   return path.replace 'scenario', 'output' # fix it later, reflect original path?

# normalizedPath = Path.join __dirname, 'scenario'
# files = getScenarioFiles normalizedPath


# Comment this line if you don't need to need importing function
# import機能が入らなければこれをコメントアウトしてください
app.injectDependencySyntax = true

# ここからimportするファイルを探す
# Search for file to import from this context
# context = new Context normalizedPath

  
# promises = files.map (filename)->
#   compiled = null
#  read = Q.denodeify(fs.readFile)
#   write = Q.denodeify(fs.writeFile)

#   read(filename, encoding:'utf8')
#     .then (content)-> compiled = app.compile content, context
#     .then (states)->  write getOutputPath(filename), JSON.stringify(states)
#     .then -> {filename, compiled}

compileScenario = (inputFolder, outputFolder)->
  read = Q.denodeify(fs.readFile)
  write = Q.denodeify(fs.writeFile)
  map = (fn)-> (arr)-> Q.all (fn obj for obj in arr)

  searchFile = (folderPath)-> Q.denodeify(Glob)(Path.join(folderPath, '*.scene'))
  # promises = (searchFile folder for folder in inputFolders)

  searchFile(inputFolder)
  .then (files)->
    console.log 'Compile scenario:', files
    files
  .then map (path)->
    dir = Path.dirname path
    context = new Context dir
    read path, {encoding:'utf8'}
    .then (content)->
      {
        path,
        compiled : app.compile content, context
      }
    .then ({path, compiled})->
      relative = Path.relative inputFolder, path
      resolved = Path.resolve outputFolder, relative
      dir = Path.dirname resolved
      File.mkdirsSync dir
      write resolved, JSON.stringify(compiled)

compileApplication = ->
setupHTML = ->

Q.all([
  compileScenario('./scenario', './output'),
  compileApplication('./output/mitudomoe.js')
])
.then (scenarioFiles, applicationFile)-> setupHTML scenarioFiles, applicationFile
.done -> console.log 'Finished'