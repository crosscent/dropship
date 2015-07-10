'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('backendCategory', {
      url: '/backend/category',
      templateUrl: '/public/modules/categories/views/create-category.client.view.html'
    }).
    state('backendCategoryEdit', {
      url: '/backend/category/:slug/edit',
      templateUrl: '/public/modules/categories/views/edit-category.client.view.html'
    });
	}
]);
