module.exports = {
    secret: "donttellanyone",
    ena: {
        url: 'https://www.ebi.ac.uk/ena/submit/drop-box/',
        username: "my-ena-username",
        password: "pianocat",
    },
    dataRoot: './data',
    ldap: {
        url: "ldap://dc.example.org:389",
        bindDn: "bindUser",
        bindCredentials: "bindPassword",
        searchBase: "OU=user,OU=example,dc=nbi,dc=org",
        searchFilter: "(sAMAccountName={{username}})"
    },
};