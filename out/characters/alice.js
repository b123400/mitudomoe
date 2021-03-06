(function() {
  var Alice, AliceController, Character, CharacterController, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('mitudomoe-character'), Character = _ref.Character, CharacterController = _ref.CharacterController;

  AliceController = (function(_super) {
    __extends(AliceController, _super);

    function AliceController() {
      return AliceController.__super__.constructor.apply(this, arguments);
    }

    AliceController.prototype.transit = function() {
      AliceController.__super__.transit.apply(this, arguments);
      if (this.newState.speech) {
        return this.character.speak(this.newState.speech);
      }
    };

    return AliceController;

  })(CharacterController);

  Alice = (function(_super) {
    __extends(Alice, _super);

    function Alice() {
      return Alice.__super__.constructor.apply(this, arguments);
    }

    Alice.prototype.names = ['alice'];

    Alice.prototype.speak = function(text) {
      return console.log('speak:', text);
    };

    Alice.prototype.getController = function(oldState, newState) {
      if (oldState == null) {
        oldState = {};
      }
      if (newState == null) {
        newState = {};
      }
      return new AliceController(this, oldState, newState);
    };

    return Alice;

  })(Character);

  module.exports = new Alice;

}).call(this);
