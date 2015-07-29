import assert from 'assert'
import 'sails-test-helper'

describe('Verification', () => {

  before(function(done) {
    database.Verifications.truncate().then(() => {
      done();
    });
  });

  afterEach(function(done) {
    database.Verifications.truncate().then(() => {
      done();
    });
  });

  it('.create should persist to the database',done => {

    const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
    const domain = 'ripple.com'  

    database.Verifications.create({
      validation_public_key: validation_public_key,
      domain: domain
    })
    .then(verification => {
      assert.strictEqual(verification.validation_public_key, validation_public_key)
      assert.strictEqual(verification.domain, domain)
      done()
    })
  })

  it('.create should require a validation_public_key',done => {

    const domain = 'ripple.com'  

    database.Verifications.create({
      domain: domain
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: validation_public_key cannot be null')
      done()
    })
  })

  it('.create should require a valid validation_public_key',done => {

    const validation_public_key = 'ramcE1KE3gxHc8Yhs6hJtE55CrjkHUQyo'
    const domain = 'ripple.com'

    database.Verifications.create({
      validation_public_key: validation_public_key,
      domain: domain
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Validation is failed')
      done()
    })
  })

  it('.create should reject an invalid error',done => {

    const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
    const error = 'doubleTrouble'  

    database.Verifications.create({
      validation_public_key: validation_public_key,
      error: error
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Validation isIn failed')
      done()
    })
  })

  it('.create should require either domain or error',done => {

    const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'

    database.Verifications.create({
      validation_public_key: validation_public_key
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Require either domain or error')
      done()
    })
  })

  it('.create should require only domain or error',done => {

    const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
    const domain = 'ripple.com'  
    const error = 'AccountDomainNotFound'  

    database.Verifications.create({
      validation_public_key: validation_public_key,
      domain: domain,
      error: error
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Require either domain or error')
      done()
    })
  })
})

