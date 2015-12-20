var fs = require( 'fs' );
var config = require( '../config.js' );
var Music = require( '../models/Music.js' );

var albums;
var pages;

//only runs once
Music.count( {}, function ( err, count ) {
	pages = Math.ceil( count / config.pageSize ),
	albums = count
});

function info(){ //keeps info uptodate
	Music.count( {}, function ( err, count ) {
		pages = Math.ceil( count / config.pageSize ),
		tracks = count
	});
	return JSON.parse( fs.readFileSync( 'package.json', 'utf8' ) );
}

module.exports = {

	getIndex: function( req, res ) {
		res.send({
			status: 'online',
			uptime: process.uptime() | 0,
			server: config.severName || 'Unknown',
			updated: info().lastRefresh || 'Unknown' ,
			version: info().version || 'Unknown',
			albums: albums || 'Unknown',
			pages: pages || 'Unknown',
			routes: [
				'/',
				'/music',
				'/music/:page',
				'/album/:id',
				'/album/search/:search',
				'/album/search/:search/:page',
				'/track/:id',
				'/track/search/:search',
				'/track/search/:search/:page',
				'/artist/:artist',
				'/artist/:artist/:page',
				'/genre/:genre',
				'/genre/:genre/:page'
			]
		});
	}

}