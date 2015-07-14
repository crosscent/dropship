'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('frontendProduct', {
      url: '/product',
      templateUrl: '/public/modules/products/views/list-product.client.view.html'
    }).
    state('frontendProductView', {
      url: '/product/:slug',
      templateUrl: '/public/modules/products/views/view-product.client.view.html',
			data: {
				pageTitle: 'Page View'
			}
    }).
    state('backendProduct', {
      url: '/backend/product',
      templateUrl: '/public/modules/products/views/create-product.client.view.html'
    }).
    state('backendProductEdit', {
      url: '/backend/product/:slug/edit',
      templateUrl: '/public/modules/products/views/edit-product.client.view.html'
    });
	}
]);
