import 'sails-test-helper'
import assert from 'assert'

describe('Clusters database table', () => {

  beforeEach(async() => {
    await database.Clusters.truncate({cascade: true})
  });

  after(async() => {
    await database.Clusters.truncate({cascade: true})
  });

  it('should persist a report for validators', async() => {
    const validation_public_keys = [
      'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
    ]

    const cluster = await database.Clusters.create({
      validation_public_keys: validation_public_keys
    })
    assert(_.isEqual(cluster.validation_public_keys, validation_public_keys))
  })

  it('should require a valid validators array', done => {
    database.Clusters.create()
    .catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: validation_public_keys cannot be null')
      done()
    })
  })

  it('should reject an invalid validation public key', done => {

    database.Clusters.create({
      validation_public_keys: [
        'invalid',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ]
    })
    .catch(error => {
      assert.strictEqual(error.message, 'Validation error: Invalid validation_public_key')
      done()
    })
  })

})
