import 'sails-test-helper'

describe('ValidationsController', () => {
  describe('POST create', () => {
    it('should save valid validation to the database',done => {
      let validation = {
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
      }
      request.post('/validations')
        .send(validation)
        .expect(200)
        .end(done)
    })

    it('.create should require a validation_public_key',done => {
      let validation = {
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
      }
      request.post('/validations')
        .send(validation)
        .expect(400)
        .end(done)
    })
    it('.create should require a reporter_public_key',done => {
      let validation = {
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        ledger_hash: 'CD88E6F183A139CDC13A0278E908475C83DBA096C85124C4E94895B10EA3FB8A'
      }
      request.post('/validations')
        .send(validation)
        .expect(400)
        .end(done)
    })
    it('.create should require a ledger_hash',done => {
      let validation = {
        validation_public_key: 'n9LigbVAi4UeTtKGHHTXNcpBXwBPdVKVTjbSkLmgJvTn6qKB8Mqz',
        reporter_public_key: 'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj'
      }
      request.post('/validations')
        .send(validation)
        .expect(400)
        .end(done)
    })
  })
})

