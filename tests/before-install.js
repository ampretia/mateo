'use strict';

require('chai').should();
const chai = require('chai');
const sinon = require('sinon');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-match'));
const mateo = require('../lib/mateo');

const npm = require('../lib/cmdstubs/npm');
const pip = require('../lib/cmdstubs/pip');
const wget = require('../lib/cmdstubs/wget');
const sudo = require('../lib/cmdstubs/sudo');
const linkchecker = require('../lib/cmdstubs/linkchecker');
const NEXT_UNSTABLE = {'TRAVIS_TAG':'','TRAVIS_BRANCH':'master'};

describe('before-install', () => {

    let sandbox;
    before(()=>{

    });

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#unstable, next build', () => {
        let travis_env = NEXT_UNSTABLE;

        it('good path all correct', async () => {

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