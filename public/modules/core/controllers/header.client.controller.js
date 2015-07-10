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
