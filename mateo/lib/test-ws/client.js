let io = require('socket.io-client');
let socket = io.connect('http://localhost:3333/', {
    reconnection: true
});

socket.on('connect', function () {
    console.log('connected to localhost:3333');
    let requestJson = {scriptName:'hello.sh'};
    socket.emit('runscript',JSON.stringify(requestJson));
    socket.on('response', function (data) {
        let json = JSON.parse(data);
        console.log(json.stdout);
        console.log(json.stderr);
    });
});