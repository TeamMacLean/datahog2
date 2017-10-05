const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');
const config = require('../config.js');
const AD = require('./ad');

module.exports = {
    setupPassport() {


        passport.serializeUser((user, done) => {
            // console.log('serializeUser was called');
            done(null, user);
        });

        passport.deserializeUser((obj, done) => {
            // console.log('deserializeUser was called');
            // console.log(obj);
            done(null, obj);
        });

        passport.use(new LdapStrategy({
            server: {
                url: config.ldap.url,
                bindDn: config.ldap.bindDn,
                bindCredentials: config.ldap.bindCredentials,
                searchBase: config.ldap.searchBase,
                searchFilter: config.ldap.searchFilter
            }
        }, (userLdap, done) => {

            //if(userLdap.company === 'TSL'){ //TODO check company is TSL
            //}

            // console.log('here');

            const user = {
                id: userLdap.sAMAccountName,
                username: userLdap.sAMAccountName,
                name: userLdap.name,
                mail: userLdap.mail,
                memberOf: userLdap.memberOf
            };
            AD.GetGroup(user.username)
                .then(group => {

                    user.group = group;

                    return done(null, user);
                })
                .catch(err => {
                    return done(new Error('Could not find which group you are in'), user);
                })


        }));
    },
    isAdmin(username) {
        return config.admins.indexOf(username) > -1;
    }
};