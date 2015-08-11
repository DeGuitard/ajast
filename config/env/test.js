/**
 * Test environment settings
 */

module.exports = {
    log: {
        level: "silent"
    },
    connections: {
        test: {
            adapter: 'sails-mongo',
            host: 'localhost',
            port: 27017,
            user: 'test',
            password: 'test',
            database: 'ajast-test'
        }
    }
};
