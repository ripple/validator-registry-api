import assert from 'assert'
import 'sails-test-helper'

describe('Validator', () => {

  it('.create should persist to the database',done => {

    const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'

    database.Validators.create({
      validation_public_key: validation_public_key,
      domain: 'ripple.com'
    })
    .then(validator => {
      assert.strictEqual(validator.validation_public_key, validation_public_key)
      done()
    })
  })

  it.skip('.create should require a validation_public_key')
  it.skip('.create should require a domain')
})

