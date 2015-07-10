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
exports.partials = function(req, res) {
    var name = req.params.name;
    console.log('Hurah!');
    res.render('../public/modules/' + name);
};
