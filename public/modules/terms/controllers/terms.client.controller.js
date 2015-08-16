'use strict';

var app = angular.module('core');

app.controller('TermsCreateController', ['$scope', '$location', 'Slug', 'Terms',
	function($scope, $location, Slug, Terms){

    // Listing the Partners
		$scope.article = [];
		$scope.product = [];
    Terms.query().$promise.then(function(list){
		for(var i=0; i< list.length; i++) {
			if (list[i].taxonomy === 'product') {
				$scope.product.push(list[i]);
			}
			else if (list[i].taxonomy === 'article') {
				$scope.article.push(list[i]);
			}
		}
		});

		// Create new Category
		this.create = function() {
			// Create new Category object
			var term = new Terms ({
				name: $scope.name,
        slug: Slug.slugify($scope.name),
				taxonomy: $scope.taxonomy
			});

			// Redirect after save
			term.$save(function(response) {
				$location.path('/backend/terms');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

app.controller('TermsEditController', ['$scope', '$stateParams', '$location', 'Slug', 'Terms',
	function($scope, $stateParams, $location, Slug, Terms){

    // Find Term by slug
		this.findBySlug = function() {
			$scope.term = Terms.filter(
				{'filter[where][slug]': $stateParams.slug}
			);
		};


		// Update the Term
		this.update = function() {
			// Create new Category object
			var term = $scope.term;
      term.slug = Slug.slugify(term.name);
      term.$update(function(){
        $location.path('/backend/terms');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};

		// Delete the term
		this.delete = function(){
			var term = $scope.term;
			term.$delete(function(){
				$location.path('/backend/terms');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
app.controller('TermsViewController', ['$scope', '$rootScope', '$stateParams', 'Articles', 'Terms',
	function($scope, $rootScope, $stateParams, Articles, Terms) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Article List';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'A list of articles available on Sense Forage';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
		Terms.filter(
			{'filter[where][slug]': $stateParams.slug}
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
