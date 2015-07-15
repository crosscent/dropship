'use strict';

var app = angular.module('core');

// Partners controller
app.controller('ArticlesController', ['$scope', '$rootScope', '$stateParams', 'Articles', 'Partners', 'Categories',
	function($scope, $rootScope, $stateParams, Articles, Partners, Categories) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Article List';
		this.articles = Articles.query(
			{'filter[where][published]': 'true',
			'filter[order]': 'id DESC'}
		);

		// Find existing Partner
		this.findBySlug = function() {
			Articles.filter(
				{'filter[where][slug]': $stateParams.slug}
			).$promise.then(function(item){
				$scope.article = item;
				$rootScope.pageTitle = item.name;
				$scope.articleCategory = Categories.get({
					categoryId: $scope.article.category[0].id
				});
				$scope.articlePartner = Partners.get({
					partnerId: $scope.article.partner[0].id
				});
			});
			$scope.slides = [1,2,3,4,5];
		};
	}
]);

app.controller('ArticlesCreateController', ['$scope', '$location', 'Slug', 'Articles',
	function($scope, $location, Slug, Articles){

    // Listing the Partners
		$scope.published = [];
		$scope.unpublished = [];
    Articles.query().$promise.then(function(list){
		$scope.articles = list;
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
			var article = new Articles ({
				name: $scope.name,
        slug: Slug.slugify($scope.name)
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('/backend/article');
        $scope.partner = Articles.query();
				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

app.controller('ArticlesEditController', ['$scope', '$stateParams', '$location', 'Slug', 'Articles', 'Partners', 'Categories',
	function($scope, $stateParams, $location, Slug, Articles, Partners, Categories){

    // Find existing Product
		this.findBySlug = function() {
			$scope.article = Articles.filter(
				{'filter[where][slug]': $stateParams.slug}
			);
		};

		// List of Partners
		this.partners = Partners.query();
		// List of Categories
		this.categories = Categories.query();

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
