var Sails = require('sails'),
    Barrels = require('barrels'),
    sails;

before(function(done) {
    this.timeout(10000);
    Sails.lift({
        // configuration for testing purposes
        models: {
            connection: 'test',
            migrate: 'drop'
        }
    }, function(err, server) {
        sails = server;
        if (err) return done(err);

        // By default, a user will be considered as logged in.
        sails.config.mockLogin = true;

        // Load fixtures
        var barrels = new Barrels();

        // Populate the DB
        barrels.populate(function(err) {
            return done(err, sails);
        });
    });
});

after(function(done) {
    sails.lower(done);
});