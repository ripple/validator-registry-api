import assert from 'assert'
import helper from '../test_helper'

describe('Validation', () => {

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

  it.skip('.create should require a validation_public_key')
  it.skip('.create should require a reporter_public_key')
  it.skip('.create should require a ledger_hash')
})

