import assert from 'assert'
import 'sails-test-helper'

describe('DomainVerificationService', () => {

  before(async() => {
    await database.Manifests.truncate()
    await database.Verifications.truncate()
    await database.Validations.truncate()
  });

  afterEach(async() => {
    await database.Manifests.truncate()
    await database.Verifications.truncate()
    await database.Validations.truncate()
  });

  describe('verifyValidatorDomains', () => {

    it('should record verified validator domains', async() => {

      const validation_public_key = 'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
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

    it('should record verified validator domains using master key from manifest', async() => {

      const ephemeral_public_key = 'n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2'
      const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'

      await database.Manifests.create({
        ephemeral_public_key: ephemeral_public_key,
        master_public_key: master_public_key,
        sequence: 2,
        signature: 'f1ae38a72398cf2cfcb3e3d90ec9459d46a5b5e1dc880e11eaa3dcebb1ca2072259953c993980573be9a4158fbea3ea9f993825d8764c57681470858ab1a060e'
      })
      await database.Validations.create({
        validation_public_key: ephemeral_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      })
      await DomainVerificationService.verify()
      const verification = await database.Verifications.findOne({
        where: {
          validation_public_key: master_public_key
        }
      })
      assert(verification)
      assert.strictEqual(verification.domain, 'testnet.ripple.com')

      const missing_verification = await database.Verifications.findOne({
        where: {
          validation_public_key: ephemeral_public_key
        }
      })
      assert(!missing_verification)
    })

    it('should not record AccountDomainNotFound for previously verified master public key', async() => {

      const ephemeral_public_key = 'n9KwwpYCU3ctereLW9S48fKjK4rcsvYbHmjgiRXkgWReQR9nDjCw'
      const master_public_key = 'nHUkAWDR4cB8AgPg7VXMX6et8xRTQb2KJfgv1aBEXozwrawRKgMB'
      const domain = 'testnet.ripple.com'

      await database.Manifests.create({
        ephemeral_public_key: ephemeral_public_key,
        master_public_key: master_public_key,
        sequence: 3,
        signature: '90ab59998626c2abaf1eeee6e17fdfd47aa8a0f5d17b0ce7fcc1fbe960e0f05d7fe940920ee27b76ba2fe252f34fbbd6ef5c754e4ac220a6966f110b7e2b880e'
      })
      await database.Validations.create({
        validation_public_key: ephemeral_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      })
      await database.Verifications.create({
        validation_public_key: master_public_key,
        domain: domain
      })
      await DomainVerificationService.verify()
      const verification = await database.Verifications.findOne({
        where: {
          validation_public_key: master_public_key
        },
        order: '"createdAt" DESC',
        raw: true
      })
      assert(verification)
      assert.strictEqual(verification.domain, 'testnet.ripple.com')
    })

    it('should record domain verification errors', async() => {

      const validation_public_key = 'n9KwwpYCU3ctereLW9S48fKjK4rcsvYbHmjgiRXkgWReQR9nDjCw'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
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

    it('should record error if domain is no longer verified', async() => {

      const validation_public_key = 'n9KwwpYCU3ctereLW9S48fKjK4rcsvYbHmjgiRXkgWReQR9nDjCw'
      await database.Validations.create({
        validation_public_key: validation_public_key,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A',
      })
      await database.Verifications.create({
        validation_public_key: validation_public_key,
        domain: 'rippletest.net'
      })
      await DomainVerificationService.verify()
      const verifications = await database.Verifications.findAll({
        where: {
          validation_public_key: validation_public_key
        },
        raw: true
      })
      assert(verifications)
      assert.strictEqual(verifications.length, 2)
      assert.strictEqual(verifications[1].error, 'AccountDomainNotFound')
    })
  })
})
