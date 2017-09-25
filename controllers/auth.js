const passport = require('passport');
const gravatar = require('gravatar');
const renderError = require('../lib/renderError');

module.exports = {
    signIn(req, res) {
        return res.render('signin');
    },
    signOut(req, res) {
        req.logout();
        res.redirect('/');
    },
    signInPost(req, res, next) {


        passport.authenticate('ldapauth', (err, user, info) => {
            if (err) {
                // LOG.error(err);
                return next(err);
            }
            if (!user) {
                let message = 'No such user';
                if (info && info.message) {
                    message += `, ${info.message}`;
                }
                return renderError(message, res);
            }
            req.logIn(user, err => {
                if (err) {
                    return next(err);
                }

                req.user.iconURL = gravatar.url(req.user.mail);

                //take them to the page they wanted before signing in :)
                if (req.session.returnTo) {
                    return res.redirect(req.session.returnTo);
                } else {
                    return res.redirect('/');
                }
            });
        })(req, res, next);
    }
};