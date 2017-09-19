const ENA = require('../lib/ena');
const assert = require('assert');

describe('ENA', function () {
    describe('.Run', function () {
        describe('.GetRun()', function () {
            it('should get a run', function (done) {
                let id = 'ERR978595';
                ENA.Run.GetRun('ERR978595')
                    .then(run => {
                        assert.equal(run.accession, id);
                        done();
                    })
                    .catch(err => done(err))
            });
        });
    });
});