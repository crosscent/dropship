'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
		state('backendIndex', {
			url: '/backend',
			templateUrl: '/public/modules/backend/views/index.client.view.html'
		});
	}
]);
