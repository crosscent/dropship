'use strict';

var app = angular.module('core');


app.controller('aboutController', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		// Find a list of Partners
		$rootScope.pageTitle = 'About';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'Exceeding the requirements of the term “Cultural Creatives”, defined by Paul H. Ray and Sherry Ruth Anderson, SenseForage is a platform that satisfies the craving of the modern-day intellects to make the world a better place.';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
	}
]);

app.controller('contactController', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Contact';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'Exceeding the requirements of the term “Cultural Creatives”, defined by Paul H. Ray and Sherry Ruth Anderson, SenseForage is a platform that satisfies the craving of the modern-day intellects to make the world a better place.';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
	}
]);
