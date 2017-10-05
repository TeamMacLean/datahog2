const SampleModel = require('../models/sample');

const renderError = require('../lib/renderError');

module.exports = {
    index(req, res) {
        const myGroupShortName = req.user.group.shortName;
        SampleModel
            .filter(function (sample) {
                return sample.hasFields('group').not().or(sample('group').eq(myGroupShortName))
            })
            .then(samples => {

                const mine = [];
                const unclaimed = [];

                samples.map(sample => {

                    if (sample.group) {
                        if (sample.group === myGroupShortName) {
                            mine.push(sample);
                        }
                    } else {
                        unclaimed.push(sample);
                    }

                });


                return res.render('samples/index', {samples: {mine, unclaimed}});
            })
            .catch(err => {
                return renderError(err, res);
            })

    }
};