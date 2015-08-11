import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'
import {SHA256} from '../utils'

describe('ValidationReportsController', () => {

  beforeEach(async () => {
    await database.Validations.truncate()
    await database.ValidationReports.truncate()
    await database.CorrelationScores.truncate()
  })

  after(async () => {
    await database.Validations.truncate()
    await database.ValidationReports.truncate()
    await database.CorrelationScores.truncate()
  })

  it('#index should return the latest daily report', async (done) => {
    const day = moment()
    const publicKey = 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'

    let validation = await database.Validations.create({
      validation_public_key: publicKey,
      reporter_public_key: publicKey,
      ledger_hash: SHA256(),
      createdAt: day.toDate()
    })
    await ValidationReportService.create(day.format('YYYY-MM-DD'))

    await database.CorrelationScores.create({
      date: day.format('YYYY-MM-DD'),
      quorum: 2,
      cluster: [
        'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
      ],
      coefficients: {
        'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA': 0.1,
      }
    })

    request
      .get('/reports')
      .expect(200)
      .end((error, response) => {
        assert.strictEqual(response.body.report.date, day.format('YYYY-MM-DD'))
        assert.strictEqual(response.body.report.validators[publicKey].validations, 1)
        assert.strictEqual(response.body.report.validators[publicKey].correlation, .1)
        done()
      })
  })

  it('#show should return the historical daily report for a validator', (done) => {
    const validation_public_key = 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'

    request
      .get(`/reports/${validation_public_key}`)
      .expect(200)
      .end((error, response) => {

        assert(response.body.validation_public_key)
        assert(response.body.reports.length > -1)
        done()
      })
  })

})

