import assert from 'assert'
import 'sails-test-helper'

describe('Manifests', () => {

  beforeEach(async() => {
    await database.Manifests.truncate()
    await database.Verifications.truncate()
  });

  it('.create should persist to the database',async() => {

    const manifest = {
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    }

    const dbManifest = await database.Manifests.create(manifest)
    assert.strictEqual(manifest.ephemeral_public_key, dbManifest.ephemeral_public_key)
    assert.strictEqual(manifest.master_public_key, dbManifest.master_public_key)
    assert.strictEqual(manifest.signature, dbManifest.signature)
  })

  it('.create should require an ephemeral_public_key',done => {

    database.Manifests.create({
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: ephemeral_public_key cannot be null')
      done()
    })
  })

  it('.create should require a valid ephemeral_public_key',done => {

    database.Manifests.create({
      ephemeral_public_key: 'ramcE1KE3gxHc8Yhs6hJtE55CrjkHUQyo',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    .catch(err => {
      assert(err.message.indexOf('Validation error: Invalid ephemeral_public_key')>-1)
      done()
    })
  })

  it('.create should require a master_public_key',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: master_public_key cannot be null')
      done()
    })
  })

  it('.create should require a valid master_public_key',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'ramcE1KE3gxHc8Yhs6hJtE55CrjkHUQyo',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    .catch(err => {
      assert(err.message.indexOf('Validation error: Invalid master_public_key')>-1)
      done()
    })
  })

  it('.create should require a sequence',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: sequence cannot be null')
      done()
    })
  })

  it('.create should require a signature',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: signature cannot be null')
      done()
    })
  })

  it('.create should reject duplicate entries', done => {
    database.Manifests.create({
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    .then(() => {
      return database.Manifests.create({
        ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
        master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
        sequence: 4,
        signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
      })
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error')
      done()
    })
  })


  it('.create should reject invalid signatures', done => {
    database.Manifests.create({
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4,
      signature: 'e823a3e33a076de2e83305108bd8ddc51371bb9751ec1c7cad85d1db52f2c82830e96831a5b1eb012a7b131d99426358daa4cded752b48cf7d4d2f724609c200'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Manifest has invalid signature')
      done()
    })
  })

  it('.afterCreate should revoke master key for max sequence', async() => {
    const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'
    const old_ephemeral_public_key = 'n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr'
    const new_ephemeral_public_key = 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 3,
      signature: '79edce68809fdec46dfe09bc0f7403e65e7bd4e5dd0ebfcf19ba53b22d9af2ef8ca6a74e06eee4775862e5253a7b83ad854ef2fb3c8ab8d42b0b6eab09ec3805'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 4294967295,
      signature: 'e15d7654578c9a686e338c9ae0f473660426d997d4773572490c7badb55d4e0649f7de842dbcec3550984c7cd0257c5c87c4b0409b7c3b0057094ed3eeebe80f'
    })
    const manifests = await database.Manifests.findAll({
      'where': {
        master_public_key: master_public_key
      },
      raw: true
    })
    assert(manifests instanceof Array)
    assert.strictEqual(manifests.length, 2)
    assert(manifests[0].revoked)
    assert(manifests[1].revoked)
  })

  it('.afterCreate should mark new stale manifest as revoked', async() => {
    const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'
    const old_ephemeral_public_key = 'n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr'
    const new_ephemeral_public_key = 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 3,
      signature: '79edce68809fdec46dfe09bc0f7403e65e7bd4e5dd0ebfcf19ba53b22d9af2ef8ca6a74e06eee4775862e5253a7b83ad854ef2fb3c8ab8d42b0b6eab09ec3805'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 2,
      signature: 'f1ae38a72398cf2cfcb3e3d90ec9459d46a5b5e1dc880e11eaa3dcebb1ca2072259953c993980573be9a4158fbea3ea9f993825d8764c57681470858ab1a060e'
    })
    const manifests = await database.Manifests.findAll({
      'where': {
        master_public_key: master_public_key
      },
      order: '"createdAt" DESC',
      raw: true
    })
    assert(manifests instanceof Array)
    assert.strictEqual(manifests.length, 2)
    assert.strictEqual(manifests[0].ephemeral_public_key, new_ephemeral_public_key)
    assert(manifests[0].revoked)
    assert.strictEqual(manifests[1].ephemeral_public_key, old_ephemeral_public_key)
    assert(!manifests[1].revoked)
  })

  it('.afterCreate should mark previous active manifest as revoked', async() => {
    const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'
    const old_ephemeral_public_key = 'n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr'
    const new_ephemeral_public_key = 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 3,
      signature: '79edce68809fdec46dfe09bc0f7403e65e7bd4e5dd0ebfcf19ba53b22d9af2ef8ca6a74e06eee4775862e5253a7b83ad854ef2fb3c8ab8d42b0b6eab09ec3805'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    const manifests = await database.Manifests.findAll({
      'where': {
        master_public_key: master_public_key
      },
      order: '"createdAt" DESC',
      raw: true
    })
    assert(manifests instanceof Array)
    assert.strictEqual(manifests.length, 2)
    assert.strictEqual(manifests[0].ephemeral_public_key, new_ephemeral_public_key)
    assert(!manifests[0].revoked)
    assert.strictEqual(manifests[1].ephemeral_public_key, old_ephemeral_public_key)
    assert(manifests[1].revoked)
  })

  it('.afterCreate should add new manifest keys to cache', async() => {

    const manifest = {
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    }

    await database.Manifests.create(manifest)

    const master_public_key = database.Manifests.master_keys[manifest.ephemeral_public_key]
    const ephemeral_public_key = database.Manifests.ephemeral_keys[manifest.master_public_key]

    assert(master_public_key)
    assert.strictEqual(master_public_key, manifest.master_public_key)
    assert(ephemeral_public_key)
    assert.strictEqual(ephemeral_public_key, manifest.ephemeral_public_key)
  })
  it('.afterCreate not cache new stale manifests', async() => {
    const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'
    const domain = 'testnet.ripple.com'
    const old_ephemeral_public_key = 'n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr'
    const new_ephemeral_public_key = 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 3,
      signature: '79edce68809fdec46dfe09bc0f7403e65e7bd4e5dd0ebfcf19ba53b22d9af2ef8ca6a74e06eee4775862e5253a7b83ad854ef2fb3c8ab8d42b0b6eab09ec3805'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 2,
      signature: 'f1ae38a72398cf2cfcb3e3d90ec9459d46a5b5e1dc880e11eaa3dcebb1ca2072259953c993980573be9a4158fbea3ea9f993825d8764c57681470858ab1a060e'
    })

    const cached_master_public_key = database.Manifests.master_keys[old_ephemeral_public_key]
    const cached_ephemeral_public_key = database.Manifests.ephemeral_keys[master_public_key]

    assert(cached_master_public_key)
    assert.strictEqual(cached_master_public_key, master_public_key)
    assert(cached_ephemeral_public_key)
    assert.strictEqual(cached_ephemeral_public_key, old_ephemeral_public_key)
    assert(!database.Manifests[new_ephemeral_public_key])
  })
  it('.afterCreate should remove previous active manifest from cache', async() => {
    const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'
    const old_ephemeral_public_key = 'n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr'
    const new_ephemeral_public_key = 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 3,
      signature: '79edce68809fdec46dfe09bc0f7403e65e7bd4e5dd0ebfcf19ba53b22d9af2ef8ca6a74e06eee4775862e5253a7b83ad854ef2fb3c8ab8d42b0b6eab09ec3805'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 4,
      signature: '224d3852bdaf9bdd695fdc22f3b920107c61d80091c7da5a68153fcbc62ba79f7d8e0e0125f043477ec780a6711641ef9f8c53d9eacff3116415008e6fef2401'
    })
    const manifests = await database.Manifests.findAll({
      'where': {
        master_public_key: master_public_key
      },
      order: '"createdAt" DESC',
      raw: true
    })
    const cached_master_public_key = database.Manifests.master_keys[new_ephemeral_public_key]
    const cached_ephemeral_public_key = database.Manifests.ephemeral_keys[master_public_key]

    assert(cached_master_public_key)
    assert.strictEqual(cached_master_public_key, master_public_key)
    assert(cached_ephemeral_public_key)
    assert.strictEqual(cached_ephemeral_public_key, new_ephemeral_public_key)
    assert(!database.Manifests[old_ephemeral_public_key])
  })
  it('.afterCreate does not cache when first manifest revokes the master key', async() => {
    const manifest = {
      master_public_key: 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB',
      ephemeral_public_key: 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2',
      sequence: 4294967295,
      signature: 'e15d7654578c9a686e338c9ae0f473660426d997d4773572490c7badb55d4e0649f7de842dbcec3550984c7cd0257c5c87c4b0409b7c3b0057094ed3eeebe80f'
    }

    await database.Manifests.create(manifest)

    assert(!database.Manifests[manifest.ephemeral_public_key])
    assert(!database.Manifests[manifest.master_public_key])
  })
})