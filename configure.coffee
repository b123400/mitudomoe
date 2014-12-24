# plugins = require './plugins'
Character = require './plugin/character'
Setting = require './plugin/setting'
Line = require './plugin/line'

module.exports = (app)->
  # app.use plugin for plugin in plugins

  app.use Character
  app.use Setting
  app.use Line

  app.globalStorage = {}