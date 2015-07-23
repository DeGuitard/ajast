var Sails = require('sails'),
    Barrels = require('barrels'),
    sails;

before(function(done) {
    Sails.lift({
        // configuration for testing purposes
        models: {
            connection: 'test',
            migrate: 'drop'
        }
    }, function(err, server) {
        sails = server;
        if (err) return done(err);

        // Load fixtures
        var barrels = new Barrels();

        // Populate the DB
        barrels.populate(function(err) {
            return done(err, sails);
        });
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});