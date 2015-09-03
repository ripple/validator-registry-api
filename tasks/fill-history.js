var Sails = require('sails')

module.exports = function (done) {

  const ALPHA_CLUSTER = [
    'n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7',
    'n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj',
    'n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C',
    'n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS',
    'n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA'
  ]

  Sails.lift({}, async () => {
    try {
      await ReportService.fillHistory(ALPHA_CLUSTER)
      console.log('Backfilled report history')
    } catch (error) {
      console.error('Error with backfill report history task', error)
    }

    done()
  })
};
