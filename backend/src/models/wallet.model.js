module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define(
      "wallet",
      {
        wallet_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        global_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: "wallet",
      }
    );
  
    return Wallet;
  };
  