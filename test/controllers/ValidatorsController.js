import 'sails-test-helper'

describe('ValidatorsController', () => {

  const validationPublicKey = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
  const domain = 'ripple.com'
  before(async() => {
    await database.Validations.truncate()
    await database.Verifications.truncate()

    await database.Validations.create({
      validation_public_key: validationPublicKey,
      reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
      ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
    })
    await database.Verifications.create({
      validation_public_key: validationPublicKey,
      error: 'InvalidRippleAccount'
    })
    await database.Verifications.create({
      validation_public_key: validationPublicKey,
      domain: domain
    })
  });

  after(async() => {
    await database.Validations.truncate()
    await database.Verifications.truncate()
  })

  describe('GET /validators', () => {

    it('.index should return a list of validators', done => {
      request
        .get('/validators')
        .end((err, resp) => {
          expect(resp.body.validators).to.be.instanceof(Array)
          expect(resp.body.validators).to.have.length(1)
          expect(resp.body.validators[0].validation_public_key).to.equal(validationPublicKey)
          expect(resp.body.validators[0].domain).to.equal(domain)
          done()
        })
    })
  })

  describe('GET /validators/:validation_public_key', () => {

    it('.show should return a single validator', done => {

      let url = `/validators/${validationPublicKey}`
      request
        .get(url)
        .end((err, resp) => {
          expect(resp.body.validator.validation_public_key).to.equal(validationPublicKey)
          expect(resp.body.validator.domain).to.equal(domain)
          done()
        })
    })

    it('.show should return an empty if no validators found',done => {
      request.get('/validator/dummy_validator')
        .expect(200)
        .end((err, resp) => {
          expect(resp.body.validator).to.not.exist
          done()
        })
    })
  })
})

