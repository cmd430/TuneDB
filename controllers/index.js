var fs = require( 'fs' );
var config = require( '../config.js' );

function info(){
	return JSON.parse( fs.readFileSync( 'package.json', 'utf8' ) );
}

module.exports = {

	getIndex: function( req, res ) {
		res.send({
			status: 'online',
			uptime: process.uptime() | 0,
			server: config.severName || 'Unknown',
			updated: info().lastRefresh || 'Unknown' ,
			version: info().version || 'Unkwown'
		});
	}

}