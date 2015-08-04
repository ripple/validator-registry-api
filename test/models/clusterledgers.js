import assert from 'assert'
import 'sails-test-helper'

describe('ClusterLedgers', () => {

  beforeEach(function(done) {
    database.ClusterLedgers.truncate().then(() => {
      done();
    });
  });

  after(function(done) {
    database.ClusterLedgers.truncate().then(() => {
      done();
    });
  });

  it('.create should persist to the database',async() => {

    const hash = 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'

    const ledger = await database.ClusterLedgers.create({
      ledger_hash: hash
    })
    assert.strictEqual(ledger.ledger_hash, hash)
  })

  it('.create should require a ledger_hash',done => {

    database.ClusterLedgers.create()
    .catch(err => {
      assert.strictEqual(err.message, 'notNull Violation: ledger_hash cannot be null')
      done()
    })
  })

  it('.create should require a valid ledger_hash',done => {

    database.ClusterLedgers.create({
      ledger_hash: 'a tribute to the greatest ledger in the world'
    })
    .catch(err => {
      assert.strictEqual(err.message, 'Validation error: Invalid ledger_hash')
      done()
    })
  })
})
