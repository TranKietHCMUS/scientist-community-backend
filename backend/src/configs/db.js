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

db.user = require('../models/user.model.js')(sequelize, DataTypes);
db.community = require("../models/community.model.js")(sequelize, DataTypes);
db.wallet = require("../models/wallet.model.js")(sequelize, DataTypes);
db.user_wallet = require("../models/user_wallet.model.js")(sequelize,DataTypes);

// Communities owner refers to users.id
db.community.belongsTo(db.user, { foreignKey: "owner" });
db.user.hasMany(db.community, { foreignKey: "owner" });

// Wallet created_by refers to users.id
db.wallet.belongsTo(db.user, { foreignKey: "created_by" });
db.user.hasMany(db.wallet, { foreignKey: "created_by" });

// Users global_id_active refers to wallet.id
db.user.belongsTo(db.wallet, { foreignKey: "global_id_active" });
db.wallet.hasOne(db.user, { foreignKey: "global_id_active" });

// User_wallet user_id refers to users.id
db.user_wallet.belongsTo(db.user, { foreignKey: "user_id" });
db.user.hasMany(db.user_wallet, { foreignKey: "user_id" });

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = db;