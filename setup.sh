npm install
coffee -bc *.coffee */*.coffee node_modules/functional-parser/*.coffee node_modules/functional-parser/*/*.coffee
mkdir compiled
node compile.js
