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
