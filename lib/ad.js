const config = require('../config.js');
const ActiveDirectory = require('activedirectory');

module.exports = {
    GetADSession() {
        const c = {
            url: config.ldap.url,
            baseDN: config.ldap.searchBase,
            username: config.ldap.bindDn,
            password: config.ldap.bindCredentials
        };
        return new ActiveDirectory(c);
    },
    GetManager(username) {
        return new Promise((good, bad) => {
            this.GetUser(username)
                .then(user => {
                    if (user && user.manager) {
                        this.GetUser(user.manager)
                            .then(managerObject => {
                                return good(managerObject);
                            }).catch(err => bad(err))
                    } else {
                        return bad('manager not found');
                    }
                }).catch(err => bad(err));
        })
    },
    GetUser(username) {
        return new Promise((good, bad) => {
            this.GetADSession().findUser({attributes: ['*']}, username, function (err, user) {
                    if (err || !user) {
                        return bad(new Error('User: ' + username + ' not found.'));
                    } else {
                        return good({
                            name: user.name,
                            username: user.sAMAccountName,
                            givenName: user.givenName,
                            distinguishedName: user.distinguishedName,
                            mail: user.mail,
                            manager: user.manager
                        });
                    }
                }
            )
        });
    },
    GetGroup(username) {
        return new Promise((good, bad) => {
            this.GetManager(username)
                .then(manager => {
                    return good(config.groups.reduce((p, c) => {
                            return c.manager === manager.username ? c : p;
                        }, {}
                    ));
                })
                .catch(err => bad(err));
        })
    }
};
