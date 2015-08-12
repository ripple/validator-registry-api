import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'

describe('Reports database table', () => {

  beforeEach(async() => {
    await database.Reports.truncate({cascade: true})
  });

  after(async() => {
    await database.Reports.truncate({cascade: true})
  });

  it('should persist a report for validators', done => {
    const date = moment().format('YYYY-MM-DD')
    const quorum = 2
    const cluster_validations = 14000
    const report = {
      date: date,
      quorum: quorum,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ],
      cluster_validations: cluster_validations
    }

    database.Reports.create(report)
      .then(record => {
        assert(record.id)
        assert.strictEqual(record.cluster.length, report.cluster.length)
        assert.strictEqual(record.quorum, quorum)
        assert.strictEqual(record.cluster_validations, cluster_validations)
        done()
      })
  })

  it('should reject an invalid date string', done => {

    database.Reports.create({
      date: 'invalid date',
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      ],
      cluster_validations: 14000
    })
    .catch(error => {
      assert.strictEqual(error.message, 'Validation error: date must be formatted as YYYY-MM-DD')
      done()
    })
  })

  it('should reject without a quorum provided', done => {

    database.Reports.create({
      date: '1605-11-05',
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      ],
      cluster_validations: 14000
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: quorum cannot be null')
      done()
    })
  })

  it('should reject without a date provided', done => {

    database.Reports.create({
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      ],
      cluster_validations: 14000
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: date cannot be null')
      done()
    })
  })

  it('should reject without cluster provided', done => {

    database.Reports.create({
      date: '1605-11-05',
      quorum: 2,
      cluster_validations: 14000
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: cluster cannot be null')
      done()
    })
  })

  it('should reject without validated ledgers provided', done => {

    database.Reports.create({
      date: '1605-11-05',
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      ]
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: cluster_validations cannot be null')
      done()
    })
  })

  it('should reject a quorum greater than the cluster size', done => {

    database.Reports.create({
      date: '1605-11-05',
      quorum: 5,
      cluster: [
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      ],
      cluster_validations: 14000
    }).catch(error => {
      assert.strictEqual(error.message, 'Validation error: quorum cannot be greater than cluster size')
      done()
    })
  })

  it('should reject an invalid validation public keys', done => {

    database.Reports.create({
      date: '1605-11-05',
      quorum: 2,
      cluster: [
        'invalid',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      ],
      cluster_validations: 14000
    })
    .catch(error => {
      assert.strictEqual(error.message, 'Validation error: Invalid validation_public_key')
      done()
    })
  })

})
