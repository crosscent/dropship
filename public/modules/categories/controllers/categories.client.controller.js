'use strict';

var app = angular.module('core');

// Categories controller
app.controller('CategoriesCreateController', ['$scope', '$location', 'Categories',
	function($scope, $location, Categories){

		// Create new Category
		this.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: $scope.name
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
