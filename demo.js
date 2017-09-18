'use strict';

const Run = require('./lib/ena/run');

Run.GetRun('ERR978595')
    .then(run => {
        console.log('run 0', run.object);
        run.getExperiment()
            .then(exp => {
                console.log('experiment', exp.object);
                return Promise.all([
                    exp.getStudy(),
                    exp.getSample()
                ])
            })
            .then(sampleAndStudy => {
                console.log('study', sampleAndStudy[0].object);
                console.log('sample', sampleAndStudy[1].object);
            })
            .catch(err => {
                console.error(err);
            });
    })
    .catch(err => {
        console.error('FAIL!', err);
    });