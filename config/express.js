'use strict';

var express = require('express'),
  jade = require('jade'),
	config = require('./config'),
  path = require('path');

module.exports = function() {
  // Initialize Express
  var app = express();

  // Set up Globbing model
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

  // Set up application local variables
  app.locals.cssFiles = config.getCSSAssets();

  // set jade as default engine
  app.set('view engine', 'jade');
  app.set('views', './app/views');

  // Setting the app router and static folder
  app.use('/public', express.static(path.resolve('./public')));

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  return app;
};
