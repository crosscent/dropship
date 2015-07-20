'use strict';

require('newrelic');

var init = require('./config/init')(),
  config = require('./config/config');

var app = require('./config/express')();

app.listen(config.port);

exports = module.exports = app;

console.log('server has started on port' + config.port);
