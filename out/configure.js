(function() {
  var Context;

  Context = require('mitudomoe').Context;

  module.exports = function(app) {
    app.addPlugin('line');
    app.addPlugin('character');
    return app.globalStorage = {};
  };

}).call(this);
