module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "user",
      {
        user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        full_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
        },
        day_of_birth: {
          type: DataTypes.DATE,
        },
        decription: {
          type: DataTypes.TEXT,
        },
        refresh_token: {
          type: DataTypes.STRING,
        },
        verify_code: {
          type: DataTypes.STRING,
        },
        is_verify: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        avatar: {
          type: DataTypes.STRING,
        },
        global_id_active: {
          type: DataTypes.INTEGER,
          defaultValue: null,
        },
      },
      {
        timestamps: true,
        createdAt: "created_at", // Alias createdAt as created_at
        updatedAt: "updated_at", // Alias updatedAt as updated_at
      }
    );
  
    return User;
  };
  