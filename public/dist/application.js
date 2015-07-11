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
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'item', '/articles(?:/[^/]+)?', null, null, 2);
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

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Categories', 'articles', 'item', '/articles(?:/[^/]+)?', null, null, 7);
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
    Categories.query().$promise.then(function(list){
		$scope.categories = list;
		for(var i=0; i< list.length; i++) {
			if (list[i].publish === 'true') {
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
		}).
    state('about', {
			url: '/about',
			templateUrl: '/public/modules/core/views/about.client.view.html'
		});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$window', 'Menus',
	function($scope, $rootScope, $window, Menus) {
		$scope.isCollapsed = false;
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
			$scope.isCollapsed = false;
		});
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
		Menus.addMenuItem('topbar', 'Partners', 'partner', 'item', '/partner(?:/[^/]+)?', null, null, 7);
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
