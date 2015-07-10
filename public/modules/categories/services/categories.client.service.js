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
