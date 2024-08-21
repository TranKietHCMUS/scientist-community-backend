const { community } = require("./db");

const Member = (sequelize, DataTypes) => {
  return sequelize.define("member", {
    // Primary key (composite)
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    community_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    joined: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};

module.exports = Member;
