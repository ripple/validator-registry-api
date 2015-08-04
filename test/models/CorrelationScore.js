import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'
import _      from 'lodash'

describe('CorrelationScore database table', () => {

  it('should persist a coefficient for validators', done => {
    const date = moment().format('YYYY-MM-DD')
    const quorum = 2
    const key = 'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'

    const coefficients =  {
      'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
      'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
    }

    const score = {
      date: date,
      quorum: 2,
      coefficients: coefficients,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ]
    }

    database.CorrelationScores.create(score)
      .then(record => {
        assert(record.id)
        assert.strictEqual(record.coefficients[key], 0.9888833)
        assert.strictEqual(record.cluster.length, score.cluster.length)
        assert.strictEqual(record.quorum, quorum)
        done()
      })
  })

  it('should reject an invalid date string', done => {

    database.CorrelationScores.create({
      date: 'invalid date',
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      ],
      coefficients: {
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
      }
    })
    .catch(error => {
      assert.strictEqual(error.message, 'Validation error: date must be formatted as YYYY-MM-DD')
      done()
    })
  })

  it('should reject without a quorum provided', async done => {

    await database.CorrelationScores.create({
      date: '1605-11-05',
      coefficients: {
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
      },
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ]
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: quorum cannot be null')
      done()
    })
  })

  it('should reject without a date provided', async done => {

    await database.CorrelationScores.create({
      quorum: 2,
      coefficients: {
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
      },
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ]
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: date cannot be null')
      done()
    })
  })

  it('should reject without coefficients provided', async done => {

    await database.CorrelationScores.create({
      date: '1605-11-05',
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ]
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: coefficients cannot be null')
      done()
    })
  })

  it('should reject without cluster provided', async done => {

    await database.CorrelationScores.create({
      date: '1605-11-05',
      quorum: 2,
      coefficients: {
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
      }
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: cluster cannot be null')
      done()
    })
  })

  it('should reject a quorum greater than the cluster size', async done => {

    await database.CorrelationScores.create({
      date: '1605-11-05',
      quorum: 5,
      coefficients: {
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
      },
      cluster: [
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      ]
    }).catch(error => {
      assert.strictEqual(error.message, 'Validation error: quorum cannot be greater than cluster size')
      done()
    })
  })

  it('should reject an invalid validation public keys', done => {

    database.CorrelationScores.create({
      date: '1605-11-05',
      quorum: 2,
      cluster: [
        'invalid',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      ],
      coefficients: {
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz': 0.9911,
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7': 0.9888833
      }
    })
    .catch(error => {
      assert.strictEqual(error.message, 'Validation error: only ripple validation public keys allowed')
      done()
    })
  })

})


