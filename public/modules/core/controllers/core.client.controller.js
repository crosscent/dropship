'use strict';

var app = angular.module('core');

// Partners controller
app.controller('homeController', ['$scope', '$rootScope', 'Articles',
	function($scope, $rootScope, Articles) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Platform for the cultural creatives';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'Exceeding the requirements of the term “Cultural Creatives”, defined by Paul H. Ray and Sherry Ruth Anderson, SenseForage is a platform that satisfies the craving of the modern-day intellects to make the world a better place.';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';

		$scope.newArticles = Articles.query(
			{'filter[limit]': '3',
			'filter[where][published]': 'true',
			'filter[where][publishedDate][lte]': new Date().toISOString(),
			'filter[order]': 'id DESC'}
		);
	}
]);
