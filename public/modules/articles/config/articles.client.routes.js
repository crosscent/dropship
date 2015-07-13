'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('frontendArticle', {
      url: '/article',
      templateUrl: '/public/modules/articles/views/list-article.client.view.html'
    }).
    state('frontendArticleView', {
      url: '/article/:slug',
      templateUrl: '/public/modules/articles/views/view-article.client.view.html',
			data: {
				pageTitle: 'Page View'
			}
    }).
    state('backendArticle', {
      url: '/backend/article',
      templateUrl: '/public/modules/articles/views/create-article.client.view.html'
    }).
    state('backendArticleEdit', {
      url: '/backend/article/:slug/edit',
      templateUrl: '/public/modules/articles/views/edit-article.client.view.html'
    });
	}
]);
