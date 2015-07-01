'use strict';

var express = require('express'),
  jade = require('jade'),
	config = require('./config'),
  path = require('path');

module.exports = function() {
  var app = express();

  config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  // set jade as default engine
  app.set('view engine', 'jade');
  app.set('views', './app/views');

  return app;
};
