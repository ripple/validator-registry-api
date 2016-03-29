import assert from 'assert'
import 'sails-test-helper'

describe('Validation', () => {

  beforeEach(async function() {
    await database.Manifests.truncate()
    await database.Validations.truncate()
  });

  it('.create should persist to the database',done => {

    const validation = {
      validation_public_key: 'n9LXZBs2aBiNsgBkhVJJjDX4xA4DoEBLycF6q8zRhXD1Zu3Kwbe4',
      ledger_hash: '6B0F79F7447CFAC355748111BB8C816CAE7062FA94675AB30DA237618F3BAD07',
      signature: '3045022100A762691653A95EEC5B6C820F471482DAF56DB38DA61507889A2E02CEC8CF6C4F02202D08468D83DF8EAC231445382AB21F0046B3516D2A6951FA5C58D54BA16F6492',
      ledger_index: '12345'
    }

    database.Validations.create(validation)
    .then(dbValidation => {
      assert.strictEqual(validation.ledger_hash, dbValidation.ledger_hash)
      assert.strictEqual(validation.validation_public_key, dbValidation.validation_public_key)
      assert.strictEqual(validation.signature, dbValidation.signature)
      assert.strictEqual(validation.ledger_index, dbValidation.ledger_index)
      done()
    })
  })

  it('.create should require a validation_public_key',done => {

    database.Validations.create({
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
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Invalid validation_public_key')
      done()
    })
  })

  it('.create should require a valid ledger_hash',done => {

    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'a tribute to the greatest ledger in the world'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Invalid ledger_hash')
      done()
    })
  })

  it('.create should require a ledger_hash',done => {

    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: ledger_hash cannot be null')
      done()
    })
  })

  it('.create should require a valid ledger_index',done => {

    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      ledger_index: '123abc'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Validation isInt failed')
      done()
    })
  })

  it('.create should reject duplicate entries', done => {
    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
    })
    .then(() => {
      return database.Validations.create({
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      })
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error')
      done()
    })
  })

  it('.getValidators should return list of validators', done => {
    database.Validations.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
    })
    .then(() => {
      return database.Validations.create({
        validation_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
        ledger_hash: '80B4EE4C8099ED4D063DCBDF59F1255BC80DEE3D01F2DA7472A1FD3C15954A03',
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

  it('.beforeCreate should replace validation_public_key with master_public_key from manifest', async() => {
    const manifest = {
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    }

    await database.Manifests.create(manifest)

    const validation = await database.Validations.create({
      validation_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      ledger_hash: '6B0F79F7447CFAC355748111BB8C816CAE7062FA94675AB30DA237618F3BAD07',
      signature: '3045022100A762691653A95EEC5B6C820F471482DAF56DB38DA61507889A2E02CEC8CF6C4F02202D08468D83DF8EAC231445382AB21F0046B3516D2A6951FA5C58D54BA16F6492'
    })

    assert.strictEqual(validation.validation_public_key, manifest.master_public_key)
  })
})

