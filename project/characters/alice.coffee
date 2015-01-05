{Character, CharacterController} = require 'mitudomoe-character'

class AliceController extends CharacterController
  
  transit : ->
    super
    if @newState.speech
      @character.speak @newState.speech

class Alice extends Character
  names : ['alice']

  speak : (text)-> console.log 'speak:', text
  
  getController : (oldState={}, newState={})->
    new AliceController @, oldState, newState

module.exports = new Alice