Compiler = require './core/compiler'
Context = require './core/context'
configure = require './configure'
Q = require 'q'
fs = require 'fs'
Path = require 'path'

app = new Compiler
configure app

app.connectSyntaxes = (syntaxes)->
  syntaxes.setting?.addDelegate syntaxes.character.applySetting()

# Comment this line if you don't need to need importing function
# import機能が入らなければこれをコメントアウトしてください
app.injectDependencySyntax = true

normalizedPath = Path.join __dirname, 'scenario'
getScenarioFiles = (path)->
  files = fs.readdirSync normalizedPath # fix it later
  files.map (filename)-> Path.join __dirname, 'scenario', filename

getOutputPath = (path)->
  return path.replace 'scenario', 'compiled' # fix it later

files = getScenarioFiles normalizedPath

# ここからimportするファイルを探す
# Search for file to import from this context
context = new Context normalizedPath


  
promises =
  for filename in files
    do (filename)->
      Q.denodeify(fs.readFile)(filename, encoding:'utf8')
        .then (content)-> app.compile content, context
        .then (states)-> Q.denodeify(fs.writeFile) getOutputPath(filename), JSON.stringify(states)

Q.all(promises).done ->
  console.log 'Finished'