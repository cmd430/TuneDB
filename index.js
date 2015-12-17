var cluster = require( 'cluster' );
var cpuCount = require( 'os' ).cpus().length;
var cron = require( 'cron' );
var domain = require( 'domain' ); //Deprecated!

var app = require( 'express' )();

var config = require( './config.js' );
require( './setup.js' )( config, app );
require( './routes.js' )( app );

if( cluster.isMaster ) {
	
	// Fork the child threads
    for ( var i = 0; i < Math.min( cpuCount, config.threads ); i++ ) {
		cluster.fork();
    }

	cluster.on('disconnect', function( worker ) {
		console.error( 'worker ' + worker.process.pid + 'disconnected, spinning up another!' );
		cluster.fork();
	});
	
	//Only scan for new music on master thread...
	var scope = domain.create();
	scope.run(function() {
            var helpers = require( './lib/helpers.js' );
            try {
                var job = new cron.CronJob( config.update, 
                    function(){
                        helpers.refreshDatabase();
                    }, function () {
                        // This function is executed
						// when the job stops
                    },
                    true
                );
                console.info( 'Cron job started' );
            } catch( ex ) {
                console.error( 'Cron pattern not valid' );
            }
            // Start update as soon as server launches..
            helpers.refreshDatabase();
        });

        scope.on( 'error', function( err ) {
            console.error( 'error', er.stack );
			//this is not inherently good, and will leak resources
			//but since this is in the master im not sure how to 
			//handle restarting it without killing the whole server....
        });
	
} else {
	
	app.listen( config.port );
}
