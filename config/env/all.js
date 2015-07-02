'use strict';

module.exports = {
	port: process.env.PORT || 3000,
	templateEngine: 'JADE',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css'
			]
		}
	}
};
