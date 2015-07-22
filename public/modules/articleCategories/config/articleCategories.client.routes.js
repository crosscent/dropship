'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('backendArticleCategory', {
      url: '/backend/articleCategory',
      templateUrl: '/public/modules/articleCategories/views/create-articleCategory.client.view.html'
    }).
    state('backendArticleCategoryEdit', {
      url: '/backend/articleCategory/:slug/edit',
      templateUrl: '/public/modules/articleCategories/views/edit-articleCategory.client.view.html'
    }).
		state('ArticleCategoryView', {
			url: '/category/:slug',
			templateUrl: '/public/modules/articleCategories/views/view-articleCategory.client.view.html'
		});
	}
]);
