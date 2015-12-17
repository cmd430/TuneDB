module.exports = {
	
	port: 80,
	threads: 2,
	pageSize: 50,
	severName: require( 'os' ).hostname(),
	update: '00 00 * * * *', //update every hour
	fileStorage: './media', //path to stored music files
	artwork: false, //artwork in base64, or null, off by default
	verbose: false, //extra info printed out
	db: {
		host: 'localhost',
		port: 27017,
		name: 'music'
	}
	
}