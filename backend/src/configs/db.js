const {Sequelize, DataTypes} = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER_DB,
    process.env.PASSWORD_DB, {
        host: process.env.HOST_DB,
        dialect: 'mysql',
        operatorsAliases: false,
    }
);

sequelize.authenticate()
.then(() => {
    console.log('connected..');
})
.catch(err => {
    console.log('Error'+ err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../models/user.model.js')(sequelize, DataTypes);
db.community = require("../models/community.model.js")(sequelize, DataTypes);
db.globalId = require("../models/global-id.model.js")(sequelize, DataTypes);

Users.hasMany(GlobalID, { foreignKey: 'userId' });
GlobalID.belongsTo(Users, { foreignKey: 'userId' });

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = db;