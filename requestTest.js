const ENA = require('./lib/ena');

ENA.Run.GetAllRuns()
    .then(runs => {
        console.log('done', `got ${runs.length} runs`);
    })
    .catch(err => console.error(err));