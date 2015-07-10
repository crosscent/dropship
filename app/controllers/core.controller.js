'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res, next) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
