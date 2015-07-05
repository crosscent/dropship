'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.controller');
	var user = require('../../app/controllers/user.controller');
	app.get('/login', user.login);
	app.post('/login', user.auth);
	app.get('/admin', user.restrict, user.admin);
	app.get('/*', core.index);
};
