(function() {
  var Generator, Mitudomoe, app, configure, first;

  Mitudomoe = require('mitudomoe').Mitudomoe;

  configure = require('./configure');

  Generator = Mitudomoe.Generator;

  app = new Mitudomoe;

  configure(app);

  first = new Generator('hello.scene');

  app.setInput(first);

}).call(this);
