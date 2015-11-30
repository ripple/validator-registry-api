import 'sails-test-helper'

describe('ValidationsController', () => {
  beforeEach((done) => {
    database.Validations.truncate().then(() => {
      done();
    });
  });

  describe('GET /validators/:validation_public_key/validations', () => {
    const validator = 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz'
    beforeEach((done) => {
      database.Validations.create({
        validation_public_key: validator,
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
      }).then(() => done())
    })

    it('.index should return validations for validation_public_key',done => {
      request.get(`/validators/${validator}/validations`)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body.validations).to.be.instanceof(Array)
          expect(resp.body.validations).to.have.length(1)
          expect(resp.body.validations[0].validation_public_key).to.equal(validator)
          done()
        })
    })

    it('.index should return an empty array if no validations found',done => {
      request.get('/validators/dummy_validator/validations')
        .expect(200)
        .end((err, resp) => {
          expect(resp.body.validations).to.be.instanceof(Array)
          expect(resp.body.validations).to.be.empty
          done()
        })
    })
  })

  describe('GET /ledgers/:ledger_hash/validations', () => {
    const ledger_hash = 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
    beforeEach((done) => {
      database.Validations.create({
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        ledger_hash: ledger_hash
      }).then(() => done())
    })

    it('.show should return validations for ledger_hash',done => {
      request.get(`/ledgers/${ledger_hash}/validations`)
        .expect(200)
        .end((err, resp) => {
          expect(resp.body.validations).to.be.instanceof(Array)
          expect(resp.body.validations).to.have.length(1)
          expect(resp.body.validations[0].ledger_hash).to.equal(ledger_hash)
          done()
        })
    })

    it('.show should return an empty array if no validations found',done => {
      request.get('/ledgers/dummy_ledger/validations')
        .expect(200)
        .end((err, resp) => {
          expect(resp.body.validations).to.be.instanceof(Array)
          expect(resp.body.validations).to.be.empty
          done()
        })
    })
  })
})

