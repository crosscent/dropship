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
