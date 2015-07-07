import assert from 'assert'
import 'sails-test-helper'

describe('Validation', () => {

  beforeEach(function(done) {
    database.Validations.truncate().then(() => {
      done();
    });
  });

  it('.create should persist to the database',done => {

    const hash = 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'

    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
      ledger_hash: hash
    })
    .then(validation => {
      assert.strictEqual(validation.ledger_hash, hash)
      done()
    })
  })

  it('.create should require a validation_public_key',done => {

    database.Validations.create({
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: validation_public_key cannot be null')
      done()
    })
  })

  it('.create should require a reporter_public_key',done => {

    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: reporter_public_key cannot be null')
      done()
    })
  })

  it('.create should require a ledger_hash',done => {

    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: ledger_hash cannot be null')
      done()
    })
  })
})

