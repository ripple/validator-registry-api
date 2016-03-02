import assert from 'assert'
import 'sails-test-helper'

describe('Manifests', () => {

  beforeEach(async() => {
    await database.Manifests.truncate()
    await database.Verifications.truncate()
  });

  it('.create should persist to the database',async() => {

    const manifest = {
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    }

    const dbManifest = await database.Manifests.create(manifest)
    assert.strictEqual(manifest.ephemeral_public_key, dbManifest.ephemeral_public_key)
    assert.strictEqual(manifest.master_public_key, dbManifest.master_public_key)
    assert.strictEqual(manifest.signature, dbManifest.signature)
  })

  it('.create should require an ephemeral_public_key',done => {

    database.Manifests.create({
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: ephemeral_public_key cannot be null')
      done()
    })
  })

  it('.create should require a valid ephemeral_public_key',done => {

    database.Manifests.create({
      ephemeral_public_key: 'ramcE1KE3gxHc8Yhs6hJtE55CrjkHUQyo',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    .catch(err => {
      assert(err.message.indexOf('Validation error: Invalid ephemeral_public_key')>-1)
      done()
    })
  })

  it('.create should require a master_public_key',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: master_public_key cannot be null')
      done()
    })
  })

  it('.create should require a valid master_public_key',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'ramcE1KE3gxHc8Yhs6hJtE55CrjkHUQyo',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    .catch(err => {
      assert(err.message.indexOf('Validation error: Invalid master_public_key')>-1)
      done()
    })
  })

  it('.create should require a sequence',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: sequence cannot be null')
      done()
    })
  })

  it('.create should require a signature',done => {

    database.Manifests.create({
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4
    })
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: signature cannot be null')
      done()
    })
  })

  it('.create should reject duplicate entries', done => {
    database.Manifests.create({
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    .then(() => {
      return database.Manifests.create({
        ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
        master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
        sequence: 4,
        signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
      })
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error')
      done()
    })
  })

  it('.create should reject invalid signatures', done => {
    database.Manifests.create({
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'e823a3e33a076de2e83305108bd8ddc51371bb9751ec1c7cad85d1db52f2c82830e96831a5b1eb012a7b131d99426358daa4cded752b48cf7d4d2f724609c200'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Manifest has invalid signature')
      done()
    })
  })

  it('.afterCreate should add new manifest keys to cache', async() => {

    const manifest = {
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    }

    await database.Manifests.create(manifest)

    const master_public_key = database.Manifests.getMasterKey(manifest.ephemeral_public_key)

    assert(master_public_key)
    assert.strictEqual(master_public_key, manifest.master_public_key)
  })

  it('.afterCreate should not cache new stale manifests', async() => {
    const master_public_key = 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B'
    const domain = 'testnet.ripple.com'
    const old_ephemeral_public_key = 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA'
    const new_ephemeral_public_key = 'n9KXuFUqkykLVr8oDwDeNuu33akSuUXShNER4y96Uco88R4xwpB5'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 2,
      signature: '58a01747386a7dc26e21512c52a7a01ef6ad2efc99fc2ecf0d288665f7bf7e831949abf7129dada2c47f5633ffa73a1a00d5fc061892ecead3a014a99924480e'
    })

    const cached_master_public_key = database.Manifests.getMasterKey(old_ephemeral_public_key)
    assert(cached_master_public_key)
    assert.strictEqual(cached_master_public_key, master_public_key)
    assert(!database.Manifests.getMasterKey(new_ephemeral_public_key))
  })

  it('.afterCreate should remove previous active manifest from cache', async() => {
    const master_public_key = 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B'
    const old_ephemeral_public_key = 'n9KXuFUqkykLVr8oDwDeNuu33akSuUXShNER4y96Uco88R4xwpB5'
    const new_ephemeral_public_key = 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA'

    await database.Manifests.create({
      ephemeral_public_key: old_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 2,
      signature: '58a01747386a7dc26e21512c52a7a01ef6ad2efc99fc2ecf0d288665f7bf7e831949abf7129dada2c47f5633ffa73a1a00d5fc061892ecead3a014a99924480e'
    })
    await database.Manifests.create({
      ephemeral_public_key: new_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    const manifests = await database.Manifests.findAll({
      'where': {
        master_public_key: master_public_key
      },
      order: '"createdAt" DESC',
      raw: true
    })
    const cached_master_public_key = database.Manifests.getMasterKey(new_ephemeral_public_key)

    assert(cached_master_public_key)
    assert.strictEqual(cached_master_public_key, master_public_key)
    assert(!database.Manifests.getMasterKey(old_ephemeral_public_key))
  })

  it('.afterCreate does not cache when first manifest revokes the master key', async() => {
    const manifest = {
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      ephemeral_public_key: 'n9KVoK1g4NuSuMXqScpVhRVbBDNmLD8tPWeRKdewNVUN5F87YjwR',
      sequence: 4294967295,
      signature: '4d62df5d4cdc66b96a2fab58739515a636662cdf9d50d3b35ca7986293a72c3c0b5d518355274850e73e801628c5b6c7830546eab098f4e4548199bdc4993405'
    }

    await database.Manifests.create(manifest)

    assert(!database.Manifests[manifest.ephemeral_public_key])
    assert(!database.Manifests[manifest.master_public_key])
  })

  it('.loadCache stores manifests from database in cache', async() => {
    const master_public_key = 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B'
    const good_ephemeral_public_key = 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA'
    const stale_ephemeral_public_key = 'n9KXuFUqkykLVr8oDwDeNuu33akSuUXShNER4y96Uco88R4xwpB5'
    const another_master_public_key = 'nHBijVWHoQqDqeH9wBaessKAiAtNNPchCyg87zKC59JP3zQAWaFc'
    const another_good_ephemeral_public_key = 'n9KgeRR7WGdqiNXVsfhG4FYLpPQqRYVDD6d7yKijqZ8U3eQyk2cn'

    await database.Manifests.create({
      ephemeral_public_key: good_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    await database.Manifests.create({
      ephemeral_public_key: stale_ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 2,
      signature: '58a01747386a7dc26e21512c52a7a01ef6ad2efc99fc2ecf0d288665f7bf7e831949abf7129dada2c47f5633ffa73a1a00d5fc061892ecead3a014a99924480e'
    })
    await database.Manifests.create({
      ephemeral_public_key: another_good_ephemeral_public_key,
      master_public_key: another_master_public_key,
      sequence: 20,
      signature: '6f9b07782513dbbe5bb87d939855fa84053cce2f63905e4b518aba41f31ee3016ab8628d99b6e041797aedc103629214e6f15e92e33248d2f932044e42c5d50a'
    })

    await database.Manifests.loadCache()

    const cached_master_public_key = database.Manifests.getMasterKey(good_ephemeral_public_key)
    const another_cached_master_public_key = database.Manifests.getMasterKey(another_good_ephemeral_public_key)

    assert(cached_master_public_key)
    assert.strictEqual(cached_master_public_key, master_public_key)
    assert(another_cached_master_public_key)
    assert.strictEqual(another_cached_master_public_key, another_master_public_key)
    assert(!database.Manifests.getMasterKey(stale_ephemeral_public_key))
  })

  it('.loadCache does not store revoked manifests from database in cache', async() => {
    const master_public_key = 'nHBijVWHoQqDqeH9wBaessKAiAtNNPchCyg87zKC59JP3zQAWaFc'
    const ephemeral_public_key = 'n9KgeRR7WGdqiNXVsfhG4FYLpPQqRYVDD6d7yKijqZ8U3eQyk2cn'
    const revoked_master_public_key = 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B'
    const stale_ephemeral_public_key = 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA'
    const another_stale_ephemeral_public_key = 'n9KVoK1g4NuSuMXqScpVhRVbBDNmLD8tPWeRKdewNVUN5F87YjwR'

    await database.Manifests.create({
      ephemeral_public_key: ephemeral_public_key,
      master_public_key: master_public_key,
      sequence: 20,
      signature: '6f9b07782513dbbe5bb87d939855fa84053cce2f63905e4b518aba41f31ee3016ab8628d99b6e041797aedc103629214e6f15e92e33248d2f932044e42c5d50a'
    })
    await database.Manifests.create({
      ephemeral_public_key: stale_ephemeral_public_key,
      master_public_key: revoked_master_public_key,
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    })
    await database.Manifests.create({
      ephemeral_public_key: another_stale_ephemeral_public_key,
      master_public_key: revoked_master_public_key,
      sequence: 4294967295,
      signature: '4d62df5d4cdc66b96a2fab58739515a636662cdf9d50d3b35ca7986293a72c3c0b5d518355274850e73e801628c5b6c7830546eab098f4e4548199bdc4993405'
    })

    await database.Manifests.loadCache()

    const cached_master_public_key = database.Manifests.getMasterKey(ephemeral_public_key)

    assert(cached_master_public_key)
    assert.strictEqual(cached_master_public_key, master_public_key)
    assert(!database.Manifests.getMasterKey(stale_ephemeral_public_key))
    assert(!database.Manifests.getMasterKey(another_stale_ephemeral_public_key))
  })

  it('.getEphemeralKey should return current master key\'s ephemeral key', async() => {
    const manifest = {
      ephemeral_public_key: 'n9LRZXPh1XZaJr5kVpdciN76WCCcb5ZRwjvHywd4Vc4fxyfGEDJA',
      master_public_key: 'nHU5wPBpv1kk3kafS2ML2GhyoGJuHhPP4fCa2dwYUjMT5wR8Dk5B',
      sequence: 4,
      signature: 'ba37041d4d9739ebf721a75f7a9e408d92b9920e71a6af5a9fe11e88f05c8937771e1811cf262f489b69c67cc80c96518a6e5c17091dd743246229d21ee2c00c'
    }

    await database.Manifests.create(manifest)

    const ephemeral_public_key = await database.Manifests.getEphemeralKey(manifest.master_public_key)
    assert.strictEqual(ephemeral_public_key, manifest.ephemeral_public_key)
  })
})