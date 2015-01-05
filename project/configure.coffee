{Context} = require 'mitudomoe'

Character = require 'mitudomoe-character'
Setting = require 'mitudomoe-setting'
Line = require 'mitudomoe-line'

module.exports = (app)->
  app.use Character
  app.use Setting
  app.use Line

  app.globalStorage = {}