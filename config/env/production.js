'use strict';

module.exports = {
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-slugify/angular-slugify.js',
				'public/lib/angulartics/dist/angulartics.min.js',
				'public/lib/angulartics/dist/angulartics-ga.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};
