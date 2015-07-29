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

  it('.create should require a valid validation_public_key',done => {

    database.Validations.create({
      validation_public_key: 'ramcE1KE3gxHc8Yhs6hJtE55CrjkHUQyo',
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Validation is failed')
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

  it('.countByValidatorInLast24Hours should return integers', done => {
    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
    })
    .then(() => {
      return database.Validations.create({
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        ledger_hash: '80B4EE4C8099ED4D063DCBDF59F1255BC80DEE3D01F2DA7472A1FD3C15954A03',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      })
    })
    .then(() => {
      database.Validations.countByValidatorInLast24Hours().then(counts => {
        assert.strictEqual(counts[0].validations_count, 2)
        done()
      }) 
    })
  })

  it('.getValidators should return list of validators', done => {
    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
    })
    .then(() => {
      return database.Validations.create({
        validation_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
        ledger_hash: '80B4EE4C8099ED4D063DCBDF59F1255BC80DEE3D01F2DA7472A1FD3C15954A03',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      })
    })
    .then(() => {
      database.Validations.getValidators().then(validators => {
        assert(validators instanceof Array)
        assert.strictEqual(validators.length, 2)
        done()
      })
    })
  })
})

