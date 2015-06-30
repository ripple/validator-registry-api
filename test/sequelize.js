import Sails from 'sails'
import assert from 'assert'

describe('sequelize database connection', () => {

  before(done => Sails.lift(done))

  it('should have a connection to the database',() => {

    assert(typeof database.sequelize)
  })
})

