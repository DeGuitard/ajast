var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string' },
    email     : { type: 'email' },
    passports : { collection: 'Passport', via: 'user' }
  }
};

module.exports = User;
