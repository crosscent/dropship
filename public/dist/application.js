'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'sense-forage';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngSanitize', 'ui.bootstrap', 'ui.router', 'ui.utils', 'slugifier', 'angulartics', 'angulartics.google.analytics'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$urlMatcherFactoryProvider',
	function($locationProvider, $urlMatcherFactoryProvider) {
		$locationProvider.html5Mode(true);
		$urlMatcherFactoryProvider.strictMode(false);
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Life style', 'category/lifestyle', 'item', '', null, null, 2);
    Menus.addMenuItem('topbar', 'Design', 'category/design', 'item', '', null, null, 3);
    Menus.addMenuItem('topbar', 'Society', 'category/Society', 'item', '', null, null, 4);
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('backendArticleCategory', {
      url: '/backend/articleCategory',
      templateUrl: '/public/modules/articleCategories/views/create-articleCategory.client.view.html'
    }).
    state('backendArticleCategoryEdit', {
      url: '/backend/articleCategory/:slug/edit',
      templateUrl: '/public/modules/articleCategories/views/edit-articleCategory.client.view.html'
    }).
		state('ArticleCategoryView', {
			url: '/category/:slug',
			templateUrl: '/public/modules/articleCategories/views/view-articleCategory.client.view.html'
		});
	}
]);

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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('ArticleCategories', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('//calm-woodland-4818.herokuapp.com/api/articleCategories/:categoryId/:controller', { categoryId: '@id'},
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
				headers: {'Authorization': $cookies.get('user')}
			},
			filter: {
				method: 'GET',
				params: {
					controller: 'findOne'
				}
			},
			update: {
				method: 'PUT',
				headers: {'Authorization': $cookies.get('user')}
			}
		});
	}
]);


'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('frontendArticle', {
      url: '/article',
      templateUrl: '/public/modules/articles/views/list-article.client.view.html'
    }).
    state('frontendArticleView', {
      url: '/article/:slug',
      templateUrl: '/public/modules/articles/views/view-article.client.view.html',
			data: {
				pageTitle: 'Page View'
			}
    }).
    state('backendArticle', {
      url: '/backend/article',
      templateUrl: '/public/modules/articles/views/create-article.client.view.html'
    }).
    state('backendArticleEdit', {
      url: '/backend/article/:slug/edit',
      templateUrl: '/public/modules/articles/views/edit-article.client.view.html'
    });
	}
]);

'use strict';

var app = angular.module('core');

// Articles controller
app.controller('ArticlesController', ['$scope', '$rootScope', '$stateParams', 'Articles', 'Partners', 'ArticleCategories',
	function($scope, $rootScope, $stateParams, Articles, Partners, ArticleCategories) {
		// Find a list of Articles
		$rootScope.pageTitle = 'Article List';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'A list of articles available on Sense Forage';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
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
				$rootScope.metaKeywords = 'culture, self-development, global issues';
				$rootScope.metaDescription = item.excerpt;
				$rootScope.metaImage = item.image[0].link;
				$scope.articleCategory = ArticleCategories.get({
					categoryId: $scope.article.category
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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Articles', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('//calm-woodland-4818.herokuapp.com/api/articles/:articleId/:controller', { articleId: '@id'},
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
				headers: {'Authorization': $cookies.get('user')}
			},
			published: {
				method: 'GET',
			},
			filter: {
				method: 'GET',
				params: {
					controller: 'findOne'
				}
			},
			update: {
				method: 'PUT',
				headers: {'Authorization': $cookies.get('user')}
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
		state('backendIndex', {
			url: '/backend',
			templateUrl: '/public/modules/backend/views/index.client.view.html'
		});
	}
]);


'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('backendCategory', {
      url: '/backend/category',
      templateUrl: '/public/modules/categories/views/create-category.client.view.html'
    }).
    state('backendCategoryEdit', {
      url: '/backend/category/:slug/edit',
      templateUrl: '/public/modules/categories/views/edit-category.client.view.html'
    });
	}
]);

'use strict';

var app = angular.module('core');

// Categories controller
app.controller('CategoriesCreateController', ['$scope', '$location', 'Slug', 'Categories',
	function($scope, $location, Slug, Categories){

    // Listing the Categories
		$scope.published = [];
		$scope.unpublished = [];
    Categories.query(
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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Categories', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('//calm-woodland-4818.herokuapp.com/api/categories/:categoryId/:controller', { categoryId: '@id'},
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
				headers: {'Authorization': $cookies.get('user')}
			},
			filter: {
				method: 'GET',
				params: {
					controller: 'findOne'
				}
			},
			update: {
				method: 'PUT',
				headers: {'Authorization': $cookies.get('user')}
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/404');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: '/public/modules/core/views/home.client.view.html',
			data: {
				pageTitle: 'Home'
			}
		});
	}
]);

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
			'filter[order]': 'id DESC'}
		);
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$window', 'Menus',
	function($scope, $rootScope, $window, Menus) {
		if($window.innerWidth > 740) {
			$scope.isCollapsed = true;
		}
		else {
			$scope.isCollapsed = false;
		}
		$scope.menu = Menus.getMenu('topbar');
		$rootScope.url = $window.location.href;
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){
				$rootScope.url = $window.location.href;
			});


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			if($window.innerWidth > 740) {
				$scope.isCollapsed = true;
			}
			else {
				$scope.isCollapsed = false;
			}
		});
	}
]);

'use strict';

var app = angular.module('core');

app.directive('scroll', ['$window',
  function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind('scroll', function() {
             if (this.pageYOffset >= 75) {
                 scope.boolChangeClass = true;
                 console.log('Scrolled below header.');
             } else {
                 scope.boolChangeClass = false;
                 console.log('Header is in view.');
             }
            scope.$apply();
        });
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar', true);
	}
]);

'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Partners', 'partner', 'item', '/partner(?:/[^/]+)?', null, null, 8);
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('frontendPartner', {
      url: '/partner',
      templateUrl: '/public/modules/partners/views/list-partner.client.view.html'
    }).
    state('frontendPartnerView', {
      url: '/partner/:slug',
      templateUrl: '/public/modules/partners/views/view-partner.client.view.html',
			data: {
				pageTitle: 'Page View'
			}
    }).
    state('backendPartner', {
      url: '/backend/partner',
      templateUrl: '/public/modules/partners/views/create-partner.client.view.html'
    }).
    state('backendPartnerEdit', {
      url: '/backend/partner/:slug/edit',
      templateUrl: '/public/modules/partners/views/edit-partner.client.view.html'
    });
	}
]);

'use strict';

var app = angular.module('core');

// Partners controller
app.controller('PartnersController', ['$scope', '$rootScope', '$stateParams', 'Partners',
	function($scope, $rootScope, $stateParams, Partners) {
		// Find a list of Partners
		$rootScope.pageTitle = 'Partner List';
		$rootScope.metaKeywords = 'culture, self-development, global issues';
		$rootScope.metaDescription = 'A list of collaborating partners of Sense Forage';
		$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
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
				$rootScope.metaKeywords = 'culture, self-development, global issues';
				$rootScope.metaDescription = item.shortDescription;
				$rootScope.metaImage = item.logo;
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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Partners', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('//calm-woodland-4818.herokuapp.com/api/partners/:partnerId/:controller', { partnerId: '@id'},
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
				headers: {'Authorization': $cookies.get('user')}
			},
			published: {
				method: 'GET',
			},
			filter: {
				method: 'GET',
				params: {
					controller: 'findOne'
				}
			},
			update: {
				method: 'PUT',
				headers: {'Authorization': $cookies.get('user')}
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Shop', 'product', 'item', '/product(?:/[^/]+)?', null, null, 9);
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
    state('frontendProduct', {
      url: '/product',
      templateUrl: '/public/modules/products/views/list-product.client.view.html'
    }).
    state('frontendProductView', {
      url: '/product/:slug',
      templateUrl: '/public/modules/products/views/view-product.client.view.html',
			data: {
				pageTitle: 'Page View'
			}
    }).
    state('backendProduct', {
      url: '/backend/product',
      templateUrl: '/public/modules/products/views/create-product.client.view.html'
    }).
    state('backendProductEdit', {
      url: '/backend/product/:slug/edit',
      templateUrl: '/public/modules/products/views/edit-product.client.view.html'
    });
	}
]);

'use strict';

var app = angular.module('core');

// Partners controller
app.controller('ProductsController', ['$scope', '$rootScope', '$stateParams', 'Products', 'Partners', 'Categories',
	function($scope, $rootScope, $stateParams, Products, Partners, Categories) {

		// Find a list of Products
		this.find = function() {
				$rootScope.pageTitle = 'Product List';
				$rootScope.metaKeywords = 'culture, self-development, global issues';
				$rootScope.metaDescription = 'Some of the work of arts by our partners';
				$rootScope.metaImage = '//crosscent.s3.amazonaws.com/logo.ico';
				$scope.products = Products.query(
					{'filter[where][published]': 'true',
					'filter[order]': 'id DESC'}
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
				$rootScope.metaKeywords = 'culture, self-development, global issues';
				$rootScope.metaDescription = item.description;
				$rootScope.metaImage = item.image[0].link;
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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Products', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('//calm-woodland-4818.herokuapp.com/api/products/:productId/:controller', { productId: '@id'},
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
				headers: {'Authorization': $cookies.get('user')}
			},
			published: {
				method: 'GET',
			},
			filter: {
				method: 'GET',
				params: {
					controller: 'findOne'
				}
			},
			update: {
				method: 'PUT',
				headers: {'Authorization': $cookies.get('user')}
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', '', 'item', '/(?:/[^/]+)?', null, null, 0);
    Menus.addMenuItem('topbar', 'About', 'about', 'item', '/about(?:/[^/]+)?', null, null, 1);
    Menus.addMenuItem('topbar', 'Contact', 'contact', 'item', '/contact(?:/[^/]+)?', null, null, 9);
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Home state routing
		$stateProvider.
    state('about', {
			url: '/about',
			templateUrl: '/public/modules/static/views/about.client.view.html'
		}).
    state('contact', {
			url: '/contact',
			templateUrl: '/public/modules/static/views/contact.client.view.html'
		});
	}
]);

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

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
    state('backendTerms', {
      url: '/backend/terms',
      templateUrl: '/public/modules/terms/views/create-terms.client.view.html'
    }).
    state('backendTermsEdit', {
      url: '/backend/terms/:slug/edit',
      templateUrl: '/public/modules/terms/views/edit-terms.client.view.html'
    });
	}
]);

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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Terms', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('//calm-woodland-4818.herokuapp.com/api/terms/:articleId/:controller', { articleId: '@id'},
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
				headers: {'Authorization': $cookies.get('user')}
			},
			published: {
				method: 'GET',
			},
			filter: {
				method: 'GET',
				params: {
					controller: 'findOne'
				}
			},
			update: {
				method: 'PUT',
				headers: {'Authorization': $cookies.get('user')}
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('login', {
			url: '/login',
			templateUrl: '/public/modules/core/views/home.client.view.html'
		});
	}
]);

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Users', ['$resource',
	function($resource) {
		return $resource('https://hudson-leaf-4774.herokuapp.com/api/users/:userId', { categoryId: '@_id' },
    {
			list: {
				method: 'GET'
			}
		});
	}
]);
