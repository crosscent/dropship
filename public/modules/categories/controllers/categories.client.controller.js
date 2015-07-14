'use strict';

var app = angular.module('core');

// Categories controller
app.controller('CategoriesCreateController', ['$scope', '$location', 'Slug', 'Categories',
	function($scope, $location, Slug, Categories){

    // Listing the Categories
		$scope.published = [];
		$scope.unpublished = [];
    Categories.query().$promise.then(function(list){
		$scope.categories = list;
		for(var i=0; i< list.length; i++) {
			if (list[i].published === true) {
				$scope.published.push(list[i]);
			}
			else {
				$scope.unpublished.push(list[i]);
			}
		}
		});



		// Create new Category
		this.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: $scope.name,
        slug: Slug.slugify($scope.name)
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('/backend/category');
        $scope.categories = Categories.query();
				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

app.controller('CategoriesEditController', ['$scope', '$stateParams', '$location', 'Slug', 'Categories',
	function($scope, $stateParams, $location, Slug, Categories){

    // Find existing Product
		this.findBySlug = function() {
			$scope.category = Categories.filter(
				{'filter[where][slug]': $stateParams.slug}
			);
		};

		// Create new Category
		this.update = function() {
			// Create new Category object
			var category = $scope.category;
      category.slug = Slug.slugify(category.name);
      category.$update(function(){
        $location.path('/backend/category');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};
	}
]);
