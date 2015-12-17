var Music = require( '../models/Music.js' );
var async = require( 'async' );
var fs = require('fs');
var seed = require( 'seedrandom' );
var json = JSON.parse( fs.readFileSync( 'package.json', 'utf8' ) );

var media = require( './media.js' );
var providers = [
	media
];

var config = require( '../config.js' );

//helpers
var helpers = {

	getInfo: function( track, callback ){
	//get info for item
		try {
			console.info( 'Grabbing Meta', track.title );
			Music.findOne({
				_id: seed( track.album + track.year ).int32()
			}, function( err, doc ) {
				if ( err || !doc ) {
					//New Album
					console.info( 'New Album \'' + track.album + '\'' );
					var newAlbum = new Music({
						_id: seed( track.album + track.year ).int32(),
						album: track.album,
						artist: track.artist,
						year: track.year,
						tracks: [
							{
								_id: seed( track.title + track.duration ).int32().toString(),
								name: track.title,
								genres: track.genre,
								track: {
									no: track.track.no,
									of: track.track.of
								},
								disk: {
									no: track.disk.no,
									of: track.disk.of
								},
								file: track.file,
								duration: track.duration
							}
						],
						artwork: [
							( track.picture != "" ) ? track.picture : null
						],
						num_tracks: 1,
						last_updated: +new Date()
					});
					newAlbum.save(function( err, newDocs ) {
						console.info( 'Album \'' + track.album + '\'Saved' );
						return callback( null, track );
					});
				} else {
					//Existing Album
					var album = track.album;
					var song = track.title;
					Music.findOne({
						_id: seed( track.album + track.year ).int32()
					}, 'tracks num_tracks', function( err, track_info ){
						if( err ) console.error( 'Error:', err );
						var tracks = track_info.tracks;
						if( JSON.stringify( tracks ).indexOf( track.title ) === -1 ){
							tracks.push({
								duration: track.duration,
								file: track.file,
								disk: {
									of: track.disk.of,
									no: track.disk.no
								},
								track: {
									of: track.track.of,
									no: track.track.no
								},								
								genres: track.genre,
								name: track.title,
								_id: seed( track.title + track.duration ).int32().toString()
							});
							Music.update({
								album: track.album
							}, {
								$set: {
									tracks: tracks,
									num_tracks: track_info.num_tracks + 1,
									last_updated: +new Date()
								}
							}, function( err, track ) {
								if( err ){
									console.error( 'Error:', err.message );
									return callback( null, track );
								} else {
									console.info( 'Album \'' + album + '\' Updated' );
									return callback( null, track );
								}
							});
						} else {
							console.info( 'Song \'' + song + '\' Skipped' );
							return callback( null, track );
						}
					});
				}
			});
		} catch ( err ) {
			console.error( 'Error:', err );
			return callback( null, track );
		}
	},	
	
	refreshDatabase: function() {
		var allMusic = [];
		async.each( providers, function( provider, callback ) {
			provider.getAll( function( err, music ) {
				if ( err ) return console.error( err );
				allMusic.push( music );
				callback();
			});
		}, function( error ) {
			async.mapSeries( allMusic[0], helpers.getInfo, function( err, results ) {
				json.lastRefresh = Math.floor( ( new Date ).getTime() / 1000 )
				fs.writeFile( 'package.json', JSON.stringify( json, null, 2 ), function ( err ) {
					if ( err ) return console.log( 'Update complete: Error updating time' );
					console.log( 'Update complete:', json.lastRefresh );
				});
			});
		});
	}
	
}

module.exports = helpers;