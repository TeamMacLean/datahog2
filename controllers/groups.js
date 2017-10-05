// const renderError = require('../lib/renderError');
const config = require('../config');

module.exports = {
    index(req, res) {
        const groups = config.groups.map(group => {
            return {
                name: group.name,
                shortName: group.shortName
            }
        });
        return res.render('groups/index', {groups});
    }
};