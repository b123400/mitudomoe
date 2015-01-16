{Context} = require 'mitudomoe'
Q = require 'q'
Path = require 'path'
Coffee = require 'coffee-script'

map = (fn)-> (items)-> Q.all (fn item for item in items)

build = (options)->
  app = null
  # Copy items
  getAllItemsInContext options.in
  .then map (item)->
    processSource item, options
  .then ->
    injectFramework options.out
  .then ->
    {Compiler} = require options.out.resolve 'node_modules', 'mitudomoe'
    # Boot compiler
    app = new Compiler
    configure = try require options.out.resolve('./configure')
    throw "Cannot find 'configure.js' at the root of the project " if not configure
    configure app
    app.preBuild options.in, options.out

  .then ->
    getAllItemsInContext options.in
  .then map (item)->
    processResource item, app, options

getAllItemsInContext = (context)->
  # return all file names
  # treat node_modules folder as a single item, because we don't want to modify anything
  context.readDir './'
  .then map (name)->
    # for each file
    context.stat name
    .then (stats)->
      if stats.isDirectory() and name is 'node_modules'
        {
          type : 'node_modules',
          name,
          context
        }
      else if stats.isDirectory()
        subContext = context.subContext name
        getAllItemsInContext subContext
        .then (items)->
          {
            type : 'folder',
            name,
            context,
            items
          }
      else
        # is file
        {
          type : 'file',
          name,
          context
        }

processSource = (item, options)->
  inContext = options.in
  outContext = options.out
  relativePath = inContext.relative item.context.path

  switch item.type
    when 'node_modules'
      inContext.copy inContext.resolve(relativePath, item.name), outContext.resolve relativePath, item.name
    when 'folder'
      Q.all(processSource item, options for item in item.items)
    when 'file'
      switch Path.extname(item.name).toLowerCase()
        when '.coffee'
          item.context.getContent item.name
          .then (content)->
            compiled = Coffee.compile content
            filename = Path.basename(item.name.toLowerCase(), '.coffee')+'.js'
            outContext.write outContext.resolve(relativePath, filename), compiled
        when '.js'
          # copy only
          inPath = inContext.resolve relativePath, item.name
          outPath = outContext.resolve relativePath, item.name
          inContext.copy inPath, outPath

processResource = (item, app, options)->
  if item.type is 'folder'
    Q.all(processResource subItem, app, options for subItem in item.items)
  else if Path.extname(item.name) is '.scene'
    processSceneario item, app, options
  else
    relativePath = options.in.relative item.context.path
    inPath = options.in.resolve relativePath, item.name
    outPath = options.out.resolve relativePath, item.name
    options.in.copy inPath, outPath # or symlink if ok

processSceneario = (item, app, options)->
  return null if Path.extname(item.name) isnt '.scene'
  relativePath = options.in.relative item.context.path
  inPath = options.in.resolve relativePath, item.name
  outPath = options.out.resolve relativePath, item.name

  options.in.getContent inPath
  .then (content)->
    compiled = app.compile content, item.context
    options.out.write outPath, JSON.stringify compiled

injectFramework = (targetContext)->
  frameworkPath = Path.resolve __dirname, 'node_modules', 'mitudomoe'
  targetContext.copy frameworkPath, targetContext.resolve 'node_modules', 'mitudomoe'

if require.main is module
  # called directly
  options = require 'commander'

  options.option '-i, --in [input]', 'Input folder'
    .option '-o, --out [output]', 'Output folder'
    .parse process.argv

  if not options.in or not options.out
    throw 'No input folder or output folder specified'

  options.in = new Context Path.resolve process.cwd(), options.in
  options.out = new Context Path.resolve process.cwd(), options.out

  result = build options
  result.fail (err)-> console.log 'shit',err
  result.done -> console.log 'done'
else
  module.exports = {
    build,
    Context
  }