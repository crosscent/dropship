'use strict';

var app = angular.module('core');

// Partners controller
app.controller('ProductsController', ['$scope', '$rootScope', '$stateParams', 'Products', 'Partners', 'Categories',
	function($scope, $rootScope, $stateParams, Products, Partners, Categories) {

		// Find a list of Products
		this.find = function() {
				$rootScope.pageTitle = 'Product List';
				$scope.products = Products.query(
					{'filter[where][published]': 'true'}
				);
		};
		// Find a list of Partners


		// Find existing Partner
		this.findBySlug = function() {
			Products.filter(
				{'filter[where][slug]': $stateParams.slug}
			).$promise.then(function(item){
				$scope.product = item;
				$rootScope.pageTitle = item.name;
				$scope.productCategory = Categories.get({
					categoryId: $scope.product.category[0].id
				});
				$scope.productPartner = Partners.get({
					partnerId: $scope.product.partner[0].id
				});
			});
			$scope.slides = [1,2,3,4,5];
		};

		// Find a list of Categories
		this.categories = Categories.query(
			{'filter[where][published]': 'true'}
		);

		// Filter function
		$scope.showcat = { };
		$scope.setShowCat = function(id){
			$scope.showcat = {category: id };
		};
	}
]);

app.controller('ProductsCreateController', ['$scope', '$location', 'Slug', 'Products',
	function($scope, $location, Slug, Products){

    // Listing the Partners
		$scope.published = [];
		$scope.unpublished = [];
    Products.query().$promise.then(function(list){
		$scope.products = list;
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
			var product = new Products ({
				name: $scope.name,
        slug: Slug.slugify($scope.name)
			});

			// Redirect after save
			product.$save(function(response) {
				$location.path('/backend/product');
        $scope.product = Products.query();
				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

app.controller('ProductsEditController', ['$scope', '$stateParams', '$location', 'Slug', 'Products', 'Partners', 'Categories',
	function($scope, $stateParams, $location, Slug, Products, Partners, Categories){

    // Find existing Product
		this.findBySlug = function() {
			$scope.product = Products.filter(
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
			var product = $scope.product;
      product.slug = Slug.slugify(product.name);
      product.$update(function(){
        $location.path('/backend/product');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};

    // Add to a  new Partner
    this.addPartner = function() {
      var product = $scope.product;
      if(!product.partner) {
        product.partner=[];
      }
      product.partner.push({id: ''});
    };
    // Delete a Partner
    this.deletePartner = function(index) {
      var product = $scope.product;
      product.partner.splice(index, 1);
    };

		// Add to a  new Category
		this.addCategory = function() {
			var product = $scope.product;
			if(!product.category) {
				product.category=[];
			}
			product.category.push({id: ''});
		};
		// Delete a Category
		this.deletePartner = function(index) {
			var product = $scope.product;
			product.category.splice(index, 1);
		};

		// Add a new image
		this.addImage = function() {
			var product = $scope.product;
			if(!product.image) {
				product.image=[];
			}
			product.image.push({link: '', descript: ''});
		};
		// Delete image
		this.deleteImage = function(index) {
			var product = $scope.product;
			product.image.splice(index, 1);
		};

		// Add a new image
		this.addSpec = function() {
			var product = $scope.product;
			if(!product.specification) {
				product.specification=[];
			}
			product.specification.push({title: '', descript: ''});
		};
		// Delete image
		this.deleteImage = function(index) {
			var product = $scope.product;
			product.specification.splice(index, 1);
		};
	}
]);
