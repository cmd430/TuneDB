var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var logger = require( 'morgan' );
var compress = require( 'compression' );
var responseTime = require( 'response-time' );
var serveStatic = require( 'serve-static' );

var mongoose = require( 'mongoose' );
var config = require( './config.js' );

RegExp.escape = function( text ) {
	return text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&' );
};

mongoose.connect( 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name, {
	db: { 
		native_parser: true 
	},
	replset: { 
		rs_name: 'music0', 
		connectWithNoPrimary: true, 
		readPreference: 'nearest', 
		strategy: 'ping',
		socketOptions: {
			keepAlive: 1
		}
	}, 
	server: { 
		readPreference: 'nearest', 
		strategy: 'ping',
		socketOptions: {
			keepAlive: 1
		}
	}
});

module.exports = function( config, app ) {
	
	app.use( bodyParser.json() );
	app.use( compress({
		threshold: 1400,
		level: 4,
		memLevel: 3
	}));
	app.use( responseTime() );
	app.use( logger( 'dev' ) );
	/* 'default', 'short', 'tiny', 'dev' */
	app.use(serveStatic( config.fileStorage, {
		'index': [
			'index.html'
		]
	}));
	
}