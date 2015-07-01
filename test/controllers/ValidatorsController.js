import 'sails-test-helper'
import assert from 'assert'

const validationPublicKey = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'

describe('ValidationsController', () => {
  describe('GET /validators', () => {

    before(done => {
      database.Validators.create({
        validation_public_key: validationPublicKey,
        domain: 'stevenzeiler.com'
      })
      .then(() => done())
    })

    it('should return a list of validators', done => {
      request
        .get('/validators')
        .end((err, resp) => {
          assert(resp.body.validators instanceof Array)
          done()
        })
    })
  })

  describe('GET /validators/:validation_public_key', () => {

    it('should return a single validator', done => {

      let url = `/validators/${validationPublicKey}`
      request
        .get(url)
        .end((err, resp) => {
          assert.strictEqual(resp.body.validator.validation_public_key, validationPublicKey)
          done()
        })
    })
 })
})

