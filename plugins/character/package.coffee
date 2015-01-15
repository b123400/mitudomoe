module.exports =
  preBuild : (Mitudomoe, targetContext)->

    context = targetContext
    context.readDir './characters'
    .then (files)->

      content = "module.exports = ["
      content += (files.map (f)-> "require('../characters/#{f}')").join(',')
      content += "];"
      context.writeFile './plugin/character/autoadd.js', content

  postBuild : (Mitudomoe, targetContext)->
    if Mitudomoe.options.noCompiler
      Mitudomoe.rootContext.unlink './plugin/character/'
