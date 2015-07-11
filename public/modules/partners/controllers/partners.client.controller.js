'use strict';

var app = angular.module('core');

// Partners controller
app.controller('PartnersController', ['$scope', '$rootScope', '$stateParams', 'Partners',
	function($scope, $rootScope, $stateParams, Partners) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Partner List';
		this.partners = Partners.query(
			{'filter[where][published]': 'true'}
		);

		// Find existing Partner
		this.findBySlug = function() {
			Partners.filter(
				{'filter[where][slug]': $stateParams.slug}
			).$promise.then(function(item){
				$scope.partner = item;
				$rootScope.pageTitle = item.name;
			});
			$scope.slides = [1,2,3,4,5];
		};
	}
]);

app.controller('PartnersCreateController', ['$scope', '$location', 'Slug', 'Partners',
	function($scope, $location, Slug, Partners){

    // Listing the Partners
		$scope.published = [];
		$scope.unpublished = [];
    Partners.query().$promise.then(function(list){
		$scope.partners = list;
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
			var partner = new Partners ({
				name: $scope.name,
        slug: Slug.slugify($scope.name)
			});

			// Redirect after save
			partner.$save(function(response) {
				$location.path('/backend/partner');
        $scope.partner = Partners.query();
				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

app.controller('PartnersEditController', ['$scope', '$stateParams', '$location', 'Slug', 'Partners',
	function($scope, $stateParams, $location, Slug, Partners){

    // Find existing Product
		this.findBySlug = function() {
			$scope.partner = Partners.filter(
				{'filter[where][slug]': $stateParams.slug}
			);
		};

		// Create new Category
		this.update = function() {
			// Create new Category object
			var partner = $scope.partner;
      partner.slug = Slug.slugify(partner.name);
      partner.$update(function(){
        $location.path('/backend/partner');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};

    // Add a new image
    this.addHeader = function() {
      var partner = $scope.partner;
      if(!partner.header) {
        partner.header=[];
      }
      partner.header.push({link: ''});
    };

    // Delete image
    this.deleteHeader = function(index) {
      var partner = $scope.partner;
      partner.header.splice(index, 1);
    };
	}
]);
