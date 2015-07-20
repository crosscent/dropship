'use strict';

var express = require('express'),
  jade = require('jade'),
	config = require('./config'),
  path = require('path'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cookieParser = require('cookie-parser');

require('newrelic');

module.exports = function() {
  // Initialize Express
  var app = express();

  // Set up Prerender.IO
  app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));

  // Set up Globbing model
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

  // Set up application local variables
	app.locals.jsFiles = config.getJavaScriptAssets();
  app.locals.cssFiles = config.getCSSAssets();

  // set jade as default engine
  app.set('view engine', 'jade');
  app.set('views', './app/views');

  // set bodyParser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // set cookieParser
  app.use(cookieParser());

  // Setting the app router and static folder
  app.use('/public', express.static(path.resolve('./public')));

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

  return app;
};
