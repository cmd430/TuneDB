var id3 = require( 'musicmetadata' );
var async = require( 'async' );
var fs = require( 'fs' );
var path = require( 'path' );
var dir = require('node-dir');
var btoa = require( 'btoa' );

var config = require( '../config.js' );

module.exports = {
	
	getAll: function( callback ) {
		console.log( config.fileStorage );
		//go through all files
		dir.files( config.fileStorage, function( err, files ) {
			if( err ) console.error( err );
			files.sort();
			var allMusic = [];
			async.each( files, function( file, l_callback ){
				if( !/.mp3$/.test( file ) ) return setTimeout( function() {	l_callback();	}, 0 );
				console.info( 'Processing file ', file );
				id3( fs.createReadStream( path.resolve( file ) ), { 
					duration: true 
				}, function ( err, metadata ) {
					if ( err ) console.error( err );
					console.info( 'pushing info for', metadata.title )
					
					//Temp disabled because the amount of data crashes browser....
					metadata.picture = null;
					//if( metadata.picture[0] ) {
					//	var cover = new Uint8Array(new ArrayBuffer( metadata.picture[0]['data'].length));
					//	for ( var i = 0; i <  metadata.picture[0]['data'].length; i++ ) {
					//		cover[i] =  metadata.picture[0]['data'][i];
					//	}
					//	var base64String = '';
					//	for ( var i = 0; i < cover.length; i++ ) {
					//		base64String += String.fromCharCode( cover[i] );
					//	} 	
					//	metadata.picture = 'data:' + metadata.picture[0].format + ';base64,' + btoa( base64String );						
					//}
					metadata.year = metadata.year.substring( 0, 4 ); //fix for year sometimes returing a date string...
					metadata.file = file.replace( /\\/g, '/' );
					metadata.file = metadata.file.replace( path.normalize( config.fileStorage ), '' )
					allMusic.push( metadata );
					setTimeout( function() {
						l_callback();
					}, 0 );
				});
			}, function( err ){
				if( err ) console.error( err );
				return callback( null, allMusic );
			});
		});
	}
	
}