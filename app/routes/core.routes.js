'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.controller');
	app.route('/').get(core.index);
};
