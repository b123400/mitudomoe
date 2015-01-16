{Mitudomoe} = require 'mitudomoe'
configure = require './configure'
Generator = Mitudomoe.Generator

app = new Mitudomoe
configure app

first = new Generator 'hello.scene'
app.setInput first
