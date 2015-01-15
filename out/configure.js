(function() {
  var Context;

  Context = require('mitudomoe').Context;

  module.exports = function(app) {
    app.addPlugin('character');
    app.addPlugin('dependency');
    return app.globalStorage = {};
  };

}).call(this);
