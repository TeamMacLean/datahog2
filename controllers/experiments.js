const ExperimentModel = require('../models/experiment');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res) {

        ExperimentModel
            .then(experiments => {
                return res.render('experiment/index', {experiments});
            })
            .catch(err => {
                return renderError(err, res);
            })

    }
};