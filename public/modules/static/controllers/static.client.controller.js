'use strict';

var app = angular.module('core');


app.controller('aboutController', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		// Find a list of Partners
		$rootScope.pageTitle = 'About';
	}
]);

app.controller('contactController', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Contact';
	}
]);
