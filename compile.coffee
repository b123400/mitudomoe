{Compiler} = require './core/compiler'
Context = require './core/context'
configure = require './configure'
Q = require 'q'
fs = require 'fs'
Path = require 'path'

app = new Compiler
configure app

app.connectSyntaxes = (syntaxes)->
  {setting, character} = syntaxes
  setting?.addDelegate character.applySetting()


getScenarioFiles = (path)->
  files = fs.readdirSync normalizedPath # fix it later
  files.map (filename)-> Path.join __dirname, 'scenario', filename

getOutputPath = (path)->
  return path.replace 'scenario', 'compiled' # fix it later

normalizedPath = Path.join __dirname, 'scenario'
files = getScenarioFiles normalizedPath


# Comment this line if you don't need to need importing function
# import機能が入らなければこれをコメントアウトしてください
app.injectDependencySyntax = true

# ここからimportするファイルを探す
# Search for file to import from this context
context = new Context normalizedPath


  
promises = files.map (filename)->
  compiled = null
  read = Q.denodeify(fs.readFile)
  write = Q.denodeify(fs.writeFile)

  read(filename, encoding:'utf8')
    .then (content)-> compiled = app.compile content, context
    .then (states)->  write getOutputPath(filename), JSON.stringify(states)
    .then -> {filename, compiled}

Q.all(promises).done (result)->
  console.log JSON.stringify result, null, '  '
  console.log 'Finished'