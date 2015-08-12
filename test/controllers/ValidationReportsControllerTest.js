import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'
import {SHA256} from '../utils'

describe('ValidationReportsController', () => {

  const publicKey = 'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'

  const date = moment().subtract(1, 'days').format('YYYY-MM-DD')

  beforeEach(async () => {
    await database.Validations.truncate()
    await database.ValidationReports.truncate()
    await database.CorrelationScores.truncate()

    const days = [
      moment().subtract(1, 'days'),
      moment().subtract(2, 'days'),
      moment().subtract(3, 'days')
    ]

    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        await database.Validations.create({
          validation_public_key: publicKey,
          reporter_public_key: publicKey,
          ledger_hash: SHA256(),
          createdAt: days[i].toDate()
        })
      }
      const duplicateLedger = SHA256()
      for (let j=0; j<3; j++) {
        await database.Validations.create({
          validation_public_key: publicKey,
          reporter_public_key: publicKey,
          ledger_hash: duplicateLedger,
          createdAt: days[i].toDate()
        })
      }
      await database.CorrelationScores.create({
        date: days[i].format('YYYY-MM-DD'),
        quorum: 2,
        cluster: [
          'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
          'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
        ],
        coefficients: {
          'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA': {
            correlation: (i+1) * 0.1
          }
        }
      })

      await ValidationReportService.create(days[i].format('YYYY-MM-DD'))
    }
  })

  after(async () => {
    await database.Validations.truncate()
    await database.ValidationReports.truncate()
    await database.CorrelationScores.truncate()
  })

  it('#index should return the latest daily report', async (done) => {

    request
      .get('/reports')
      .expect(200)
      .end((error, response) => {
        assert.strictEqual(response.body.report.date, date)
        assert.strictEqual(response.body.report.validators[publicKey].validations, 4)
        assert.strictEqual(response.body.report.validators[publicKey].correlation_coefficient, .1)
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
        assert.strictEqual(response.body.reports.length, 3)
        assert(response.body.reports[0].date > response.body.reports[1].date &&
               response.body.reports[1].date > response.body.reports[2].date)
        for (let i=0; i<3; i++) {
          assert.strictEqual(response.body.reports[i].validations, 4)
          assert.strictEqual(response.body.reports[i].correlation_coefficient, (i+1) * 0.1)
        }
        done()
      })
  })

})

