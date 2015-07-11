'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/404');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: '/public/modules/core/views/home.client.view.html',
			data: {
				pageTitle: 'Home'
			}
		}).
    state('about', {
			url: '/about',
			templateUrl: '/public/modules/core/views/about.client.view.html'
		});
	}
]);
