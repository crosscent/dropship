'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Home state routing
		$stateProvider.
    state('about', {
			url: '/about',
			templateUrl: '/public/modules/static/views/about.client.view.html'
		}).
    state('contact', {
			url: '/contact',
			templateUrl: '/public/modules/static/views/contact.client.view.html'
		});
	}
]);
