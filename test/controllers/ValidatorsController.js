import 'sails-test-helper'

const validationPublicKey = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
const domain = 'ripple.com'

describe('ValidatorsController', () => {

  beforeEach((done) => {
    database.Validators.truncate()
    .then(() => {
      database.Validators.create({
        validation_public_key: validationPublicKey,
        domain: domain
      })
    })
    .then(() => {
      database.Validators.create({
        validation_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
        domain: domain
      })
    })
    .then(() => done());
  });

  describe('GET /validators', () => {

    it('.index should return a list of validators', done => {
      request
        .get('/validators')
        .end((err, resp) => {
          expect(resp.body.validators).to.be.instanceof(Array)
          expect(resp.body.validators).to.have.length(2)
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

