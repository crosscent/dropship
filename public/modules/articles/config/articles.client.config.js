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
