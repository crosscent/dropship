'use strict';

module.exports = function(){
	if (process.env.NODE_ENV) {
		console.error('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
	} else {
		console.error('NODE_ENV is not defined! Using default development environment');
    process.env.NODE_ENV = 'development';
	}
};
