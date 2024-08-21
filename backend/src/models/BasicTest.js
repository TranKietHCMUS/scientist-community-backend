module.exports = (sequelize, DataTypes) => {
  const BasicTest = sequelize.define("basic_test", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    community: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Community",
        key: "id",
      },
    },
  });
  return BasicTest;
};
