import assert from 'assert'
import 'sails-test-helper'

describe('DomainVerificationService', () => {

  before(async() => {
    await database.Verifications.truncate()
    await database.Validations.truncate()
  });

  afterEach(async() => {
    await database.Verifications.truncate()
    await database.Validations.truncate()
  });

  describe('verifyValidatorDomains', () => {

    it('should record verified validator domains', async() => {

      const validation_public_key = 'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      })
      await DomainVerificationService.verify()
      const verification = await database.Verifications.findOne({
        where: {
          validation_public_key: validation_public_key
        }
      })
      assert(verification)
      assert.strictEqual(verification.domain, 'ripple.com')
    })

    it('should record domain verification errors', async() => {

      const validation_public_key = 'n9KwwpYCU3ctereLW9S48fKjK4rcsvYbHmjgiRXkgWReQR9nDjCw'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      })
      await DomainVerificationService.verify()
      const verification = await database.Verifications.findOne({
        where: {
          validation_public_key: validation_public_key
        }
      })
      assert(verification)
      assert.strictEqual(verification.error, 'AccountDomainNotFound')
    })

    it('should not record domain if verification state is unchanged', async() => {

      const validation_public_key = 'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      })
      await DomainVerificationService.verify()
      await DomainVerificationService.verify()
      const verifications = await database.Verifications.findAll({
        where: {
          validation_public_key: validation_public_key
        }
      })
      assert(verifications)
      assert.strictEqual(verifications.length, 1)
    })

    it('should not record error if verification state is unchanged', async() => {

      const validation_public_key = 'n9KwwpYCU3ctereLW9S48fKjK4rcsvYbHmjgiRXkgWReQR9nDjCw'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      })
      await DomainVerificationService.verify()
      await DomainVerificationService.verify()
      const verifications = await database.Verifications.findAll({
        where: {
          validation_public_key: validation_public_key
        }
      })
      assert(verifications)
      assert.strictEqual(verifications.length, 1)
    })
  })
})
