'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('frontendPartner', {
      url: '/partner',
      templateUrl: '/public/modules/partners/views/list-partner.client.view.html'
    }).
    state('frontendPartnerView', {
      url: '/partner/:slug',
      templateUrl: '/public/modules/partners/views/view-partner.client.view.html',
			data: {
				pageTitle: 'Page View'
			}
    }).
    state('backendPartner', {
      url: '/backend/partner',
      templateUrl: '/public/modules/partners/views/create-partner.client.view.html'
    }).
    state('backendPartnerEdit', {
      url: '/backend/partner/:slug/edit',
      templateUrl: '/public/modules/partners/views/edit-partner.client.view.html'
    });
	}
]);
