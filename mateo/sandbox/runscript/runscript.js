/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const path = require('path');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const winston = require('winston');

let root = '/home/ubuntu/testscripts';
let logger = winston.loggers.get('mateo');


let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('runscript',async function(msg){
        console.log('script to run is : ' + msg);
        let data = JSON.parse(msg);
        let returnData = await runScript(data.scriptName,data.env);
        socket.emit('response',JSON.stringify(returnData));
    });
});

http.listen(3333, function(){
    console.log('listening on *:3333');
});

/**
 * Run a bash shell script
 * @param {String} scriptName string of the script to run - fully qualififed
 * @param {Object} env   name-value pairs of the environment
 * @return {Object} with the rc, stdout, and stderr
 */
async function runScript(scriptName,env){
    let script = path.resolve(root,scriptName);
    // let cmdbin = path.resolve(__dirname,'cmdbin');

    // let modifiedpath = cmdbin+path.delimiter+process.env.PATH;
    let returnData= {
        rc: 0,
        stdout: '',
        stderr: ''
    };

    let cmdEnvironment = env || null;
    // cmdEnvironment.PATH=modifiedpath;

    // fs.unlinkSync(path.resolve(root,'build.cfg'));

    let options = {cwd : root, env: cmdEnvironment };
    try {
    // need to fork this now.
        const { stdout } = await execFile(script,[], options );
        returnData.stdout=stdout;
        logger.info('Returned with stdout length=:'+stdout.length);
        // logger.info('> STDOUT\n',stdout.slice(stdout.length-200));
    } catch (err){
        logger.info(`Error code is ${err.code}`);
        logger.info('Returned with stdout length=:'+err.stdout.length);
        logger.info('Returned with stderr length=:'+err.stderr.length);
        // logger.info('> STDOUT\n',err.stdout.slice(err.stdout.length-200));
        // logger.info('> STDERR\n',err.stderr.slice(err.stderr.length-200));
        returnData.stdout=err.stdout;
        returnData.stderr=err.stderr;
        returnData.rc=err.code;
    }

    return returnData;

}
