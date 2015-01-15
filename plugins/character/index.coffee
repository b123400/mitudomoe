{Context, utility} = require 'mitudomoe'
path = require 'path'
CharacterSyntax = try require './syntax'

AutoImportedCharacters = require './autoadd' # generated

###
# state keys: characters, characterModifier
#
# characters : ['aaa','bbb','ccc'] identifier of characters
#
# characterModifier : {
#   <identifier> : { speech : ..., emotion: ... }
# }
###

class CharacterController
  constructor : (@character, @oldState={}, @newState={})->

  transit : ->

class Character
  getController : -> new CharacterController @

class CharacterPlugin
  @characters = []
  @find = (name)->
    return c for c in @characters when name in c.names

  @add = (character)->
    @characters.push character if character not in @characters

  @autoAdd = (context)->
    files = context.readDir('characters').filter (f)-> path.extname(f) is '.js'
    @add require context.resolve('characters/'+file) for file in files

###
# @return identifiers of character
###
diffCharacters = (oldState, newState)->
  # TODO: handle createa and delete
  diff = utility.diffArray oldState.characters, newState.characters, flat:true
  diff.added
    .concat diff.removed
    .concat Object.keys(newState.characterModifier || {})
    .filter (v,i,self)-> i is self.indexOf v

findControllerForName = (name, oldState, newState)->
  oldState = oldState.characterModifier?[name]
  newState = newState.characterModifier?[name]
  CharacterPlugin.find(name)?.getController? oldState, newState

module.exports = {
  name : 'character',
  CharacterController,
  Character,
  Syntax : CharacterSyntax

  # autoAdd : ->
  #   console.log "Auto adding characters from #{path.resolve('.')}/characters"
  #   CharacterPlugin.autoAdd new Context path.resolve '.'
    
  getControllers : (oldState, newState)->
    findControllerForName id, oldState, newState for id in diffCharacters oldState, newState

  transit : (oldState, newState, delta)->
    if oldState.characterName isnt newState.characterName
      character.setCurrentCharacter newState.character
}