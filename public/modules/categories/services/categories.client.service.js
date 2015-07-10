'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('core').factory('Categories', ['$resource',
	function($resource) {
		return $resource('http://calm-woodland-4818.herokuapp.com/api/categories', '',
    {
			list: {
				method: 'GET'
			}
		});
	}
]);
