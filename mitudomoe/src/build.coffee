Path = require 'path'
Q = require 'q'

module.exports =
  preBuild : (app)-> (context)->
    relative = (p)-> Path.relative context.path, p
    path = Path.resolve __dirname, 'plugins.js'
    content = "module.exports={"
    content += ("require('#{relative p}')" for p in app.pluginFolders).join ','
    content += "};"
    console.log 'writing ', content, 'to', path
    context.write path, content
    .then =>
      Q.all (p.preBuild? context for p in app.plugins)