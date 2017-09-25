const SampleModel = require('../models/sample');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res) {

        SampleModel
            .then(samples => {
                return res.render('samples/index', {samples});
            })
            .catch(err => {
                return renderError(err, res);
            })

    }
};