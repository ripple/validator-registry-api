import assert from 'assert'
import 'sails-test-helper'

describe('sequelize database connection', () => {

  it('should have a connection to the database',() => {

    assert(typeof database.sequelize)
  })
})

