'use strict';

var app = angular.module('core');

// Partners controller
app.controller('homeController', ['$scope', '$rootScope', 'Articles',
	function($scope, $rootScope, Articles) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Platform for the cultural creatives';

		$scope.newArticles = Articles.query(
			{'filter[limit]': '3',
			'filter[where][published]': 'true',
			'filter[order]': 'id DESC'}
		);
	}
]);
