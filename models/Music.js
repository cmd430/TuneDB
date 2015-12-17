var mongoose = require( 'mongoose' );

module.exports = mongoose.model( 'Music', {
    _id: { 
		type: String, 
		required: true, 
		index: { 
			unique: true 
		}
	},
    album: String,
    artist: String,
	year: String,
	tracks: [],
	artwork: [],
	num_tracks: Number,
    last_updated: Number,
	__v: {
		type: Number, 
		select: false
	}
});