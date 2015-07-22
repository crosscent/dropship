'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Lifestyle', 'category/lifestyle', 'item', '', null, null, 2);
    Menus.addMenuItem('topbar', 'Design', 'category/design', 'item', '', null, null, 3);
    Menus.addMenuItem('topbar', 'Society', 'category/Society', 'item', '', null, null, 4);
	}
]);
