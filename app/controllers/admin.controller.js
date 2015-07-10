'use strict';

/**
 * Admin Page
 */
exports.index = function(req, res, next) {
	res.render('backend/index', {
		user: req.cookies.user || null,
		request: req
	});
};
