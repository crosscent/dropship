'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'sense-forage';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ui.bootstrap', 'ui.router'];

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

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Home state routing
		$stateProvider.
		state('backendIndex', {
			url: '/backend',
			templateUrl: '/public/modules/backend/views/index.client.view.html'
		}).
		state('backendCategory', {
			url: '/backend/category',
			templateUrl: '/public/modules/categories/views/create-category.client.view.html'
		});
	}
]);

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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Categories', ['$resource', '$cookies',
	function($resource, $cookies) {
		return $resource('http://calm-woodland-4818.herokuapp.com/api/categories', '',
    {
			list: {
				method: 'GET'
			},
			save: {
				method: 'POST',
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
		state('home', {
			url: '/',
			templateUrl: '/public/modules/core/views/home.client.view.html'
		}).
    state('about', {
			url: '/about',
			templateUrl: '/public/modules/core/views/about.client.view.html'
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
