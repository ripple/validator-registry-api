import assert from 'assert'
import helper from './test_helper'

describe('sequelize database connection', () => {

  it('should have a connection to the database',() => {

    assert(typeof database.sequelize)
  })
})

