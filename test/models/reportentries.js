import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'

describe('ReportEntries database table', () => {

  let report

  before(async() => {
    await database.Reports.truncate({cascade: true})
    await database.ReportEntries.truncate()

    report = await database.Reports.create({
      date: moment().format('YYYY-MM-DD'),
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      ],
      cluster_validations: 12000
    })
  });

  afterEach(async() => {
    await database.ReportEntries.truncate()
  });

  after(async() => {
    await database.Reports.truncate({cascade: true})
  })

  it('should persist a report entry for a validator', async () => {

    const validation_public_key = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
    const validations = 10000
    const agreement_validations = 9000
    const disagreement_validations = 1000
    const agreement_coefficient = .75
    const disagreement_coefficient = .1

    const validator_report = await database.ReportEntries.create({
      validation_public_key: validation_public_key,
      validations: validations,
      agreement_validations: agreement_validations,
      disagreement_validations: disagreement_validations,
      agreement_coefficient: agreement_coefficient,
      disagreement_coefficient: disagreement_coefficient,
      report_id: report.id
    })
    assert(validator_report.id)
    assert.strictEqual(validator_report.report_id, report.id)
    assert.strictEqual(validator_report.validation_public_key, validation_public_key)
    assert.strictEqual(validator_report.validations, validations)
    assert.strictEqual(validator_report.agreement_validations, agreement_validations)
    assert.strictEqual(validator_report.disagreement_validations, disagreement_validations)
    assert.strictEqual(validator_report.agreement_coefficient, agreement_coefficient)
    assert.strictEqual(validator_report.disagreement_coefficient, disagreement_coefficient)
  })

  it('should reject without a validation_public_key provided', done => {

    database.ReportEntries.create({
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: validation_public_key cannot be null')
      done()
    })
  })

  it('should reject without validations provided', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('notNull Violation: validations cannot be null')
      done()
    })
  })

  it('should reject without a agreement_validations provided', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('notNull Violation: agreement_validations cannot be null')
      done()
    })
  })

  it('should reject without a disagreement_validations provided', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      agreement_validations: 9000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('notNull Violation: disagreement_validations cannot be null')
      done()
    })
  })

  it('should reject without a agreement_coefficient provided', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('notNull Violation: agreement_coefficient cannot be null')
      done()
    })
  })

  it('should reject without a disagreement_coefficient provided', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('notNull Violation: disagreement_coefficient cannot be null')
      done()
    })
  })

  it('should reject without a report_id provided', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
    }).catch(error => {
      assert.strictEqual(error.message, 'notNull Violation: report_id cannot be null')
      done()
    })
  })

  it('should reject an invalid validation public key', done => {

    database.ReportEntries.create({
      validation_public_key: 'invalid',
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      assert.strictEqual(error.message, 'Validation error: Invalid validation_public_key')
      done()
    })
  })

  it('should reject an invalid validations', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('Validation error: validations should be the sum of agreement_validations and disagreement_validations')
      done()
    })
  })

  it('should reject an invalid agreement_coefficient', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: 100.1,
      disagreement_coefficient: .1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('Validation error: Validation max failed')
      expect(error.message).to.have.string('Validation error: agreement_coefficient should equal agreement_validations / cluster_validations')
      done()
    })
  })

  it('should reject an invalid disagreement_coefficient', done => {

    database.ReportEntries.create({
      validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
      validations: 10000,
      agreement_validations: 9000,
      disagreement_validations: 1000,
      agreement_coefficient: .75,
      disagreement_coefficient: -0.1,
      report_id: report.id
    }).catch(error => {
      expect(error.message).to.have.string('Validation error: Validation min failed')
      expect(error.message).to.have.string('Validation error: disagreement_coefficient should be disagreement_validations / validations')
      done()
    })
  })

  it('should reject without duplicate validation_public_key and report_id', async() => {

    try {
      await database.ReportEntries.create({
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        validations: 10000,
        agreement_validations: 9000,
        disagreement_validations: 1000,
        agreement_coefficient: .75,
        disagreement_coefficient: .1,
        report_id: report.id
      })
      await database.ReportEntries.create({
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        validations: 10000,
        agreement_validations: 9000,
        disagreement_validations: 1000,
        agreement_coefficient: .75,
        disagreement_coefficient: .1,
        report_id: report.id
      })
    } catch(error) {
      assert.strictEqual(error.message, 'Validation error: One validation public key entry per report_id')
    }
  })
})