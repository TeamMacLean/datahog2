const xss = require('xss');


/**
 * Render error
 * @param err
 * @param res
 */
module.exports = function error(err, res) {
    // log.error(err);

    err = xss(err);
    console.error(err);

    if (res) {
        return res.render('error', {error: err});
    }
};