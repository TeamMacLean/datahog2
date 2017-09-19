const checker = require('../lib/checker');
// const Error = require('../lib/error');

const assert = require('assert');


describe('Checker', function () {
    describe('.checkRuns()', function () {
        it('should return an array of new runs', function (done) {
            checker.checkRuns()
                .then(newRunIDS => {
                    done();
                })
                .catch(err => done(err));
        });
    });
    describe('.processRuns()', function () {
        it('should save a new run db record for each ID', function (done) {
            // assert.equal(-1, [1, 2, 3].indexOf(4));
            let runIDS = [
                'ERR978595',
                'ERR978594',
                'ERR978593',
                'ERR978592',
                'ERR968677',
                'ERR968676',
                'ERR968675',
                'ERR968674',
                'ERR968673',
                'ERR968672',
                'ERR966170',
                'ERR966169',
            ];
            checker.processNewRuns(runIDS)
                .then(savedRuns => {
                    assert.equal(savedRuns.length, runIDS.length);
                    done();
                })
                .catch(err => done(err));
        });
    });
});