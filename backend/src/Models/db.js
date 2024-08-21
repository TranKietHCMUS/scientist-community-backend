const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_DB,
  process.env.PASSWORD_DB,
  {
    host: process.env.HOST_DB,
    dialect: "mysql",
    operatorsAliases: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel.js")(sequelize, DataTypes);
db.community = require("./communityModel.js")(sequelize, DataTypes);
db.document = require("./documentModel.js")(sequelize, DataTypes);
db.member = require("./memberModel.js")(sequelize, DataTypes);
db.basic_test = require("./BasicTest.js")(sequelize, DataTypes);

// Define relationships
db.users.hasMany(db.document, { foreignKey: "owner" });
db.document.belongsTo(db.users, { foreignKey: "owner" });
db.document.belongsTo(db.community, { foreignKey: "community_id" });
db.community.hasMany(db.document, { foreignKey: "community_id" });
db.community.hasMany(db.member, { foreignKey: "community_id" });
db.member.belongsTo(db.community, { foreignKey: "community_id" });
db.users.hasMany(db.member, { foreignKey: "user_id" });
db.member.belongsTo(db.users, { foreignKey: "user_id" });
db.users.hasMany(db.community, { foreignKey: "owner" });
db.community.belongsTo(db.users, { foreignKey: "owner" });

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

module.exports = db;
