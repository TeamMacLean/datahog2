const RunModel = require('../models/run');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res) {

        RunModel
            .then(runs => {
                return res.render('runs/index', {runs});
            })
            .catch(err => {
                return renderError(err, res);
            })

    }
};