'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Categories', 'categories', 'item', '/categories(?:/[^/]+)?', null, null, 9);
    // Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', '', 'item', '/(?:/[^/]+)?', null, null, 0);
    Menus.addMenuItem('topbar', 'About', 'about', 'item', '/about(?:/[^/]+)?', null, null, 1);
    Menus.addMenuItem('topbar', 'Contact', 'contact', 'item', '/contact(?:/[^/]+)?', null, null, 9);
	}
]);
