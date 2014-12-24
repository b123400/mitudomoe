Mitudomoe = require './core/mitudomoe'
configure = require './configure'
File = require './core/file'

app = new Mitudomoe
configure app

first = new File.Generator './compiled/hello.scene'
app.setInput first
