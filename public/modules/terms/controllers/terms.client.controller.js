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

app.controller('ArticlesEditController', ['$scope', '$stateParams', '$location', 'Slug', 'Articles', 'Partners', 'ArticleCategories',
	function($scope, $stateParams, $location, Slug, Articles, Partners, ArticleCategories){

    // Find existing Product
		this.findBySlug = function() {
			$scope.article = Articles.filter(
				{'filter[where][slug]': $stateParams.slug}
			);
		};

		// List of Partners
		this.partners = Partners.query();
		// List of Categories
		this.categories = ArticleCategories.query();

		// Create new Category
		this.update = function() {
			// Create new Category object
			var article = $scope.article;
      article.slug = Slug.slugify(article.name);
      article.$update(function(){
        $location.path('/backend/article');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};

    // Add to a  new Partner
    this.addPartner = function() {
      var article = $scope.article;
      if(!article.partner) {
        article.partner=[];
      }
      article.partner.push({id: ''});
    };
    // Delete a Partner
    this.deletePartner = function(index) {
      var article = $scope.article;
      article.partner.splice(index, 1);
    };

		// Add to a  new Category
		this.addCategory = function() {
			var article = $scope.article;
			if(!article.category) {
				article.category=[];
			}
			article.category.push({id: ''});
		};
		// Delete a Category
		this.deletePartner = function(index) {
			var article = $scope.article;
			article.category.splice(index, 1);
		};

		// Add a new image
		this.addImage = function() {
			var article = $scope.article;
			if(!article.image) {
				article.image=[];
			}
			article.image.push({link: '', descript: ''});
		};
		// Delete image
		this.deleteImage = function(index) {
			var article = $scope.article;
			article.image.splice(index, 1);
		};
	}
]);
