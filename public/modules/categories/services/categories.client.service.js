'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('https://hudson-leaf-4774.herokuapp.com/api/category', '',
    {
			list: {
				method: 'GET'
			}
		});
	}
]);
