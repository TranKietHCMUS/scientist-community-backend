module.exports = (sequelize, DataTypes) => {
    const UserWallet = sequelize.define(
      "user_wallet",
      {
        user_wallet_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        wallet_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        tableName: "user_wallet",
      }
    );
  
    return UserWallet;
  };
  