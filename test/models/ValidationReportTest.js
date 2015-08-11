import 'sails-test-helper'
import assert from 'assert'

describe('ValidationReport model', () => {

  beforeEach(async () => {
    await database.sequelize.query('delete from "ValidationReports"')
  })

  it('should persist a daily report', async () => {

    const date = '1605-11-05'

    const report = await ValidationReport.create({
      date: date,
      validators: {
        'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA': 12345,
        'n9Ljaq2jmBnk1qnuyTdv2DpvoTbbLE8sqXGwvPRQdVk5UAFiBnDM': 67890 
      }
    })

    assert(report.id)
    assert.strictEqual(report.date, date)
    assert.strictEqual(report.validators['n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'], 12345)
    assert.strictEqual(report.validators['n9Ljaq2jmBnk1qnuyTdv2DpvoTbbLE8sqXGwvPRQdVk5UAFiBnDM'], 67890)
  })

  after(async () => {
    await database.sequelize.query('delete from "ValidationReports"')
  })
})
