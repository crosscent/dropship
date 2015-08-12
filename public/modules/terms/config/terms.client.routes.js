'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
    state('backendTerms', {
      url: '/backend/terms',
      templateUrl: '/public/modules/terms/views/create-terms.client.view.html'
    }).
    state('backendTermsEdit', {
      url: '/backend/terms/:slug/edit',
      templateUrl: '/public/modules/terms/views/edit-terms.client.view.html'
    });
	}
]);
