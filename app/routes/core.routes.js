'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.controller');
	var user = require('../../app/controllers/user.controller');
	var admin = require('../../app/controllers/admin.controller');
	app.get('/login', user.login);
	app.post('/login', user.auth);
	app.all('/backend', user.restrict, admin.index);
	app.all('/backend/*', user.restrict, admin.index);
	app.get('/*', core.index);
};
