
const path = require('path');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const winston = require('winston');

let root = "/home/matthew/github/composer/";
let logger = winston.loggers.get('mateo'); 

async function runScript(scriptName,env){
    let script = path.resolve(root,scriptName);
    let cmdbin = path.resolve(__dirname,'cmdbin');
 
    let modifiedpath = cmdbin+path.delimiter+process.env.PATH;
    let returnData= {
        rc: 0,
        stdout: "",
        stderr: ""
    };

    let cmdEnvironment = env || {};
    cmdEnvironment.PATH=modifiedpath;

    let options = {cwd : root, env: cmdEnvironment };
    try {
    // need to fork this now.
        const { stdout } = await execFile(script,[], options );
        returnData.stdout=stdout;
        logger.info(`> STDOUT\n`,stdout.slice(stdout.length-200));
    } catch (err){
        logger.info(`Error code is ${err.code}`);
      
        logger.info(`> STDOUT\n`,err.stdout.slice(err.stdout.length-200));
        logger.info(`> STDERR\n`,err.stderr.slice(err.stderr.length-200));
        returnData.stdout=err.stdout;
        returnData.stderr=err.stderr;
        returnData.rc=err.code
    }
    
    return returnData;

}

module.exports.runScript=runScript;