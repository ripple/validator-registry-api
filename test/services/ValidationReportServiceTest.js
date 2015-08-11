import 'sails-test-helper'
import assert from 'assert'
import {SHA256} from '../utils'
import moment from 'moment'

describe('ValidationReportService', () => {

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
          'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA': (i+1) * 0.1,
        }
      })
    }

    await ValidationReportService.create(days[1].format('YYYY-MM-DD'))
    await ValidationReportService.create(days[2].format('YYYY-MM-DD'))
  })

  after(async () => {
    await database.Validations.truncate()
    await database.ValidationReports.truncate()
    await database.CorrelationScores.truncate()
  })

  it('#latest should return the lastest report', async () => {

    await ValidationReportService.create(date)

    const report = await ValidationReportService.latest()

    assert.strictEqual(report.date, date)
    assert.strictEqual(report.validators[publicKey].validations, 4)
    assert.strictEqual(report.validators[publicKey].correlation_coefficient, .1)
  })

  it('#historyForValidator should return all reports for validator ordered by date', async () => {

    await ValidationReportService.create(date)

    const reports = await ValidationReportService.historyForValidator(publicKey)

    assert.strictEqual(reports.length, 3)
    assert(reports[0].date > reports[1].date && reports[1].date > reports[2].date)
    for (let i=0; i<3; i++) {
      assert.strictEqual(reports[i].validations, 4)
      assert.strictEqual(reports[i].correlation_coefficient, (i+1) * 0.1)
    }
  })

  it('#compute should compute total unique validations per validator in a given day', async () => {

    const result = await ValidationReportService.compute(date)
    assert.strictEqual(result[publicKey], 4)
  })

  it('#create should compute and store total validations per validator in a given day', async () => {

    const record = await ValidationReportService.create(date)

    assert(record.id)
    assert.strictEqual(record.date, date)
    assert.strictEqual(record.validators[publicKey], 4)
  })
})


