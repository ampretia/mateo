require('chai').should();
const chai = require('chai');
const sinon = require('sinon');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const mateo = require('../lib/mateo');

const npm = require('../lib/cmdstubs/npm');
const pip = require('../lib/cmdstubs/pip');
const linkchecker = require('../lib/cmdstubs/linkchecker');
const NEXT_UNSTABLE = {"TRAVIS_TAG":"","TRAVIS_BRANCH":"MASTER"};

describe('before-install', () => {

    let sandbox;
    before(()=>{
      
    })

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#unstable, next build', () => {
        let travis_env = NEXT_UNSTABLE;

        it('good path all correct', async () => {


        });

    });

});