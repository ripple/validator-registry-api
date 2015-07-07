import assert from 'assert'
import 'sails-test-helper'

describe('Validator', () => {
  const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
  const domain = 'ripple.com'

  beforeEach(function(done) {
    database.Validators.truncate().then(() => {
      done();
    });
  });

  it('.create should persist to the database',done => {

    database.Validators.create({
      validation_public_key: validation_public_key,
      domain: domain
    })
    .then(validator => {
      assert.strictEqual(validator.validation_public_key, validation_public_key)
      done()
    })
  })

  it('.create should require a validation_public_key',done => {

    database.Validators.create({
      domain: domain
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: validation_public_key cannot be null')
      done()
    })
  })

  it('.create should require a domain',done => {

    database.Validators.create({
      validation_public_key: validation_public_key,
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: domain cannot be null')
      done()
    })
  })

  it('.create should require validation_public_key to be unique',done => {

    database.Validators.create({
      validation_public_key: validation_public_key,
      domain: domain
    })
    .then(() => {
      return database.Validators.create({
        validation_public_key: validation_public_key,
        domain: domain
      })
    })
    .then(validator => {
      expect(validator).to.not.exist;
      done()
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error')
      done()
    })
  })
})

