module.exports =
  preBuild : (source, dest)->

    dest.readDir './characters'
    .then (files)->
      content = "module.exports = ["
      content += (files.map (f)-> "require('../characters/#{f}')").join(',')
      content += "];"
      dest.writeFile './plugin/character/autoadd.js', content

  postBuild : (source, dest)->
    if source.options.noCompiler
      source.rootContext.unlink './plugin/character/'
