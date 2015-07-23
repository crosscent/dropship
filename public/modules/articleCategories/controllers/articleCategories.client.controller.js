'use strict';

var app = angular.module('core');

// Categories controller
app.controller('ArticleCategoriesCreateController', ['$scope', '$location', 'Slug', 'ArticleCategories',
	function($scope, $location, Slug, ArticleCategories){

    // Listing the Categories
		$scope.published = [];
		$scope.unpublished = [];
    ArticleCategories.query(
			{'filter[order]': 'id DESC'}
		).$promise.then(function(list){
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
			var category = new ArticleCategories ({
				name: $scope.name,
        slug: Slug.slugify($scope.name)
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('/backend/articleCategory');
        $scope.categories = ArticleCategories.query();
				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

app.controller('ArticleCategoriesEditController', ['$scope', '$stateParams', '$location', 'Slug', 'ArticleCategories',
	function($scope, $stateParams, $location, Slug, ArticleCategories){

    // Find existing Product
		this.findBySlug = function() {
			$scope.category = ArticleCategories.filter(
				{'filter[where][slug]': $stateParams.slug}
			);
		};

		// Create new Category
		this.update = function() {
			// Create new Category object
			var category = $scope.category;
      category.slug = Slug.slugify(category.name);
      category.$update(function(){
        $location.path('/backend/articleCategory');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};
	}
]);

app.controller('ArticleCategoriesViewController', ['$scope', '$rootScope', '$stateParams', 'Articles', 'ArticleCategories',
	function($scope, $rootScope, $stateParams, Articles, ArticleCategories) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Article List';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'A list of articles available on Sense Forage';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
		ArticleCategories.filter(
			{'filter[where][published]': 'true',
			'filter[where][slug]': $stateParams.slug}
		).$promise.then(function(list){
			$rootScope.pageTitle = list.name;
			$scope.articles = Articles.query(
				{'filter[where][published]': 'true',
				'filter[where][category]' : list.id,
				'filter[order]': 'id DESC'}
			);
		});
	}
]);
