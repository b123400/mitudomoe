(function() {
  module.exports = {
    preBuild: function(source, dest) {
      return dest.readDir('./characters').then(function(files) {
        var content;
        content = "module.exports = [";
        content += (files.map(function(f) {
          return "require('../characters/" + f + "')";
        })).join(',');
        content += "];";
        return dest.writeFile('./plugin/character/autoadd.js', content);
      });
    },
    postBuild: function(source, dest) {
      if (source.options.noCompiler) {
        return source.rootContext.unlink('./plugin/character/');
      }
    }
  };

}).call(this);
