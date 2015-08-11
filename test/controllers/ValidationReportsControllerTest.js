import 'sails-test-helper'
import assert from 'assert'
import moment from 'moment'
import {SHA256} from '../utils'

describe('ValidationReportsController', () => {

  beforeEach(async () => {
    await database.sequelize.query('delete from "ValidationReports"')
  })

  after(async () => {
    await database.sequelize.query('delete from "ValidationReports"')
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

    request
      .get('/reports')
      .expect(200)
      .end((error, response) => {
        assert(response.body.report.date)
        assert(response.body.report.validators)
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

