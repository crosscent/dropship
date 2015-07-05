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
