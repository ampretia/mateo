'use strict';

const app = require('../lib/app');
const debug = require('debug')('mateo:server');
const http = require('http');

let server;
let port;
/**
 * Normalize a port into a number, string, or false.
 * @param {int} val portnumber to use
 * @return {int} rationalized port number
 */
function normalizePort(val) {
    port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
   * Event listener for HTTP server "error" event.
   * @param {Error} error error that has occured
   */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}


before((done)=>{
    /**
     * Get port from environment and store in Express.
     */

    let port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', () => {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
        done();
    });

});

after(()=>{
    console.log('All Done: After');
    server.close();
    // process.exit(0);
});