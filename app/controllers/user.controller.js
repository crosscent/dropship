'use strict';


var http = require('http');


/**
 * Login Page
 */
exports.login = function(req, res, next) {
	res.render('backend/login', {
		user: req.user || null,
		request: req
	});
};

/**
 * Login Authentication
 */
exports.auth = function(req, res, next) {
	var login = JSON.stringify({
		'email': req.body.email,
		'password': req.body.password,
		'ttl': 1209600000
	});
	var headers = {
		'Content-Type': 'application/json',
		'Content-Length': login.length
	};
	var options = {
		host: 'calm-woodland-4818.herokuapp.com',
		port: 80,
		path: '/api/users/login',
		method: 'POST',
		headers: headers,
	};
	var auth = http.request(options, function(response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			if (response.statusCode===200) {
				req.session.regenerate(function(){
					req.session.user = JSON.parse(chunk).id;
					res.redirect('/admin');
				});
			}
			else {
				res.send('failed');
			}
  	});
	});
	auth.write(login);
	auth.end();
};
/**
 * Admin Page
 */
exports.admin = function(req, res, next) {
	res.send('welcome to the admin page');
};
/**
 * Restrict Middleware
 */
exports.restrict = function(req, res, next) {
	if(req.session.user ){
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
};
