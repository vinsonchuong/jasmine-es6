#!/usr/bin/env node
const path = require('path');
require('register-module')({
  name: 'jasmine-es6',
  path: path.resolve(__dirname, 'src'),
  main: 'index.js'
});
require('./node_modules/.bin/jasmine');
