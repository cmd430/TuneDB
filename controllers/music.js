var async = require( 'async' );

var Music = require( '../models/Music.js' );

var config = require( '../config.js' );

module.exports = {
	
	getMusic: function( req, res ){ 
		 Music.count( {}, function ( err, count ) {
            var pages = Math.ceil( count / config.pageSize );
            var docs = [];
            for ( var i = 1; i < pages + 1; i++ ) {
				docs.push( 'music/' + i );
			}
            res.json( docs );
        });
	},
	
	getPage: function( req, res ){
		var page = req.params.page - 1;
        var offset = page * config.pageSize;
        var query = {
			num_tracks: {
				$gt: 0
			}
		};
        var data = req.query;
        // filter elements
        if ( data.keywords ) {
            var words = data.keywords.split( ' ' );
            var regex = data.keywords.toLowerCase();
            if ( words.length > 1 ) {
                var regex = '^';
                for ( var w in words ) {
                    regex += '(?=.*\\b' + RegExp.escape( words[w].toLowerCase() ) + '\\b)';
                }
                regex += ".+";
            }
            query = {
				album: new RegExp( regex, 'gi' ), 
				num_tracks: {
					$gt: 0
				}
			};
        }
        // paging
        Music.find( query, {
            _id: 1,
            album: 1,
			artist: 1,
            year: 1,
			artwork: 1,
            num_tracks: 1,
            last_updated: 1
        }).sort({
			year: 1
		}).skip( offset ).limit( config.pageSize ).exec( function ( err, docs ) {
            res.json( docs );
        });
	},
	
	getAlbum: function( req, res ){
		Music.find({
			_id: req.params.id
		}).limit( 1 ).exec( function ( err, docs ) {
            if ( Array.isArray( docs ) ) docs = docs[0];
            res.json( docs );
        });
	},
	
	getTrack: function( req, res ){
		Music.find({
            'tracks._id': req.params.id
        }).limit( 1 ).exec( function ( err, docs ) {
			if ( Array.isArray( docs ) ) docs = docs[0];
			docs.tracks.forEach(function( track ){
				if( track._id == req.params.id ){
					docs.tracks = track;
				}
			});
			res.json( docs );
        });
	},
	
	albumSearch: function( req, res ){
		var keywords = new RegExp( RegExp.escape( req.params.search.toString().toLowerCase() ), 'gi' );
        Music.find({
            album: keywords,
            num_tracks: {
				$gt: 0
			}
        }).sort({
			album: -1
		}).exec( function ( err, docs ) {
            res.json( docs );
        });
	},
	
	albumSearchPage: function( req, res ){
		var page = req.params.page - 1;
        var offset = page * config.pageSize;
        var keywords = new RegExp( RegExp.escape( req.params.search.toString().toLowerCase() ), 'gi' );
        Music.find({
            album: keywords,
            num_tracks: {
				$gt: 0
			}
        }).sort({
			album: -1
		}).skip( offset ).limit( config.pageSize ).exec( function ( err, docs ) {
            res.json( docs );
        });
	},
	
	trackSearch: function( req, res ){
		var keywords = new RegExp( RegExp.escape( req.params.search.toString().toLowerCase() ), 'gi' );		
		Music.find({
            'tracks.name': keywords
        }).sort({
			name: -1
		}).exec( function ( err, docs ) {
			var tracks = [];
			async.each( docs, function( doc, callback ){
				var l_tracks = [];
				doc.tracks.forEach(function( track ){
					if( track.name.toLowerCase().indexOf( req.params.search.toString().toLowerCase() ) > -1 ){
						l_tracks.push( track );
					}
				});
				doc.tracks = l_tracks;
				tracks.push( doc );
				callback( null );
			}, function( err ){
				res.json( tracks.reverse() );
			});
        });
	},
	
	trackSearchPage: function( req, res ){
		var page = req.params.page - 1;
        var offset = page * config.pageSize;
        var keywords = new RegExp( RegExp.escape( req.params.search.toString().toLowerCase() ), 'gi' );
        Music.find({
            'tracks.name': keywords
        }).sort({
			name: -1
		}).skip( offset ).limit( config.pageSize ).exec( function ( err, docs ) {
			var tracks = [];
			async.each( docs, function( doc, callback ){
				var l_tracks = [];
				doc.tracks.forEach(function( track ){
					if( track.name.toLowerCase().indexOf( req.params.search.toString().toLowerCase() ) > -1 ){
						l_tracks.push( track );
					}
				});
				doc.tracks = l_tracks;
				tracks.push( doc );
				callback( null );
			}, function( err ){
				res.json( tracks.reverse() );
			});
        });
	},
	
	artistSearch: function( req, res ){
		var keywords = new RegExp( RegExp.escape( req.params.artist.toString().toLowerCase() ), 'gi' );		
		Music.find({
            artist: keywords
        }).sort({
			year: 1
		}).exec( function ( err, docs ) {
			res.json( docs );
        });
	},
	
	artistSearchPage: function( req, res ){
		var page = req.params.page - 1;
        var offset = page * config.pageSize;
		var keywords = new RegExp( RegExp.escape( req.params.artist.toString().toLowerCase() ), 'gi' );		
		Music.find({
            artist: keywords
        }).sort({
			year: 1
		}).skip( offset ).limit( config.pageSize ).exec( function ( err, docs ) {
			res.json( docs );
        });
	},
	
	genreSearch: function( req, res ){
		var keywords = new RegExp( RegExp.escape( req.params.genre.toString().toLowerCase() ), 'gi' );		
		Music.find({
            'tracks.genres': keywords
        }).sort({
			name: -1
		}).exec( function ( err, docs ) {
			var tracks = [];
			async.each( docs, function( doc, callback ){
				var l_tracks = [];
				doc.tracks.forEach(function( track ){
					if( track.genres.toLowerCase().indexOf( req.params.genre.toString().toLowerCase() ) > -1 ){
						l_tracks.push( track );
					}
				});
				doc.tracks = l_tracks;
				tracks.push( doc );
				callback( null );
			}, function( err ){
				res.json( tracks.reverse() );
			});
        });
	},
	
	genreSearchPage: function( req, res ){
		var page = req.params.page - 1;
        var offset = page * config.pageSize;
        var keywords = new RegExp( RegExp.escape( req.params.genre.toString().toLowerCase() ), 'gi' );
        Music.find({
            'tracks.genres': keywords
        }).sort({
			name: -1
		}).skip( offset ).limit( config.pageSize ).exec( function ( err, docs ) {
			var tracks = [];
			async.each( docs, function( doc, callback ){
				var l_tracks = [];
				doc.tracks.forEach(function( track ){
					if( track.genres.toLowerCase().indexOf( req.params.genre.toString().toLowerCase() ) > -1 ){
						l_tracks.push( track );
					}
				});
				doc.tracks = l_tracks;
				tracks.push( doc );
				callback( null );
			}, function( err ){
				res.json( tracks.reverse() );
			});
        });
	}
	
}