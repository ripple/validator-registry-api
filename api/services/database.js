var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var exec      = require('child-process-promise').exec;

var dbURL = "";

if (process.env.DATABASE_URL) {
  dbURL = process.env.DATABASE_URL;
} else if (process.env.POSTGRES_PORT_5432_TCP_ADDR) {
  dbURL = 'postgres://postgres:postgres@'+process.env.POSTGRES_PORT_5432_TCP_ADDR+':'+process.env.POSTGRES_PORT_5432_TCP_PORT+'/postgres';
}

var sequelize = new Sequelize(dbURL, {
  logging: false
});
var db        = {};

const MODELS_PATH = path.join(__dirname, '../models')

fs
  .readdirSync(MODELS_PATH)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(MODELS_PATH, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.migrate = async function() {
  const cmd = `sequelize --url=${dbURL} db:migrate`

  const result = await exec(cmd)
  console.log(result.stdout)
  console.error(result.stderr)
}

module.exports = db;
