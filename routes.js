var index = require( './controllers/index.js' ); 
var music = require( './controllers/music.js' ); 
var config = require( './config.js' );

module.exports = function( app ) {
	
	//index
	app.get( '/', index.getIndex );

	//music
	app.get( '/music', music.getMusic );
	app.get( '/music/:page', music.getPage ); 
	
	//get by id
	app.get( '/album/:id', music.getAlbum );
	app.get( '/track/:id', music.getTrack );
	
	//search albums by album name
	app.get( '/album/search/:search', music.albumSearch );
	app.get( '/album/search/:search/:page', music.albumSearchPage );
	
	//search tracks by track name
	app.get( '/track/search/:search', music.trackSearch );
	app.get( '/track/search/:search/:page', music.trackSearchPage );
	
	//search albums by artist name
	app.get( '/artist/:artist', music.artistSearch );
	app.get( '/artist/:artist/:page', music.artistSearchPage );
	
	//search tracks by genre
	app.get( '/genre/:genre', music.genreSearch );
	app.get( '/genre/:genre/:page', music.genreSearchPage );
	
}