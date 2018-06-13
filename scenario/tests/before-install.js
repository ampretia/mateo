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

// This is an example test file; this like any other mocha based test
// Firstly use the chai/sinon packages and extensions you wish to
require('chai').should();
const chai = require('chai');
const sinon = require('sinon');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-match'));

// Bring in the mateo library here
const mateo = require('mateo');

// From mateo also bring in the stubs that represent the commands in the shell script
const npm = mateo.cmdstubs.npm;
const pip = mateo.cmdstubs.pip;
const wget =  mateo.cmdstubs.wget;
const sudo =  mateo.cmdstubs.sudo;
const linkchecker =  mateo.cmdstubs.linkchecker;

// This is an object representing a specific environment variable set that will be used 
// in testing.
const NEXT_UNSTABLE = {'TRAVIS_TAG':'','TRAVIS_BRANCH':'master'};

describe('before-install', () => {

    let sandbox;
    before(()=>{

    });

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        mateo.reset();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#unstable, next build', () => {
        let travis_env = NEXT_UNSTABLE;

        it('good path all correct', async () => {

            // set the stubs 
            sandbox.stub(npm,'install').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(pip,'install').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(linkchecker,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(wget,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(sudo,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});

            // run the test script and ensure that all commands are run
            let data = await mateo.runScript('.travis/before-install.sh',travis_env);

            sinon.assert.calledOnce(pip.install);
            sinon.assert.calledOnce(linkchecker._run);
            sinon.assert.calledOnce(npm.install);
            sinon.assert.calledWith(npm.install,'-g','lerna@2','@alrra/travis-scripts','asciify','gnomon');

            sinon.assert.calledTwice(wget._run);
            sinon.assert.callCount(sudo._run,5);

            data.rc.should.equal(0);

        });

        it('docs build exits before installing chrome etc', async () => {

            sandbox.stub(npm,'install').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(pip,'install').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(linkchecker,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(wget,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(sudo,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});

            let env={};
            Object.assign(env,travis_env);
            env.FC_TASK='docs';

            // run the before-installs.h script
            let data = await mateo.runScript('.travis/before-install.sh',env);

            sinon.assert.notCalled(wget._run);
            sinon.assert.notCalled(sudo._run);

            data.stdout.should.match(/Doing Docs - no requirement for installations of other software/);
            data.rc.should.equal(0);

        });

        it('Abort merge build for non-release PR', async () => {

            sandbox.stub(npm,'install').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(pip,'install').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(linkchecker,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(wget,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});
            sandbox.stub(sudo,'_run').returns({exitcode : 0, stdout: 'ok',stderr:''});

            let env={};
            Object.assign(env,travis_env);
            env.FC_TASK='systest';
            env.TRAVIS_PULL_REQUEST='false';
            env.TRAVIS_REPO_SLUG='hyperledger';

            // run the before-installs.h script
            let data = await mateo.runScript('.travis/before-install.sh',env);

            sinon.assert.notCalled(wget._run);
            sinon.assert.notCalled(sudo._run);
            sinon.assert.notCalled(wget._run);
            sinon.assert.notCalled(sudo._run);
            data.stdout.should.match(/Merge build from non release PR/);
            data.rc.should.equal(0);

        });
    });

});