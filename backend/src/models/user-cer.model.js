module.exports = (sequelize,DataTypes) => {

    const UserCer= sequelize.define("user_cer", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        cer_id: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'UserCer'
    }, {
        timestamps: true,
        createdAt: 'created_at', // Alias createdAt as created_at
        updatedAt: 'updated_at'  // Alias updatedAt as updated_at
    });

    UserCer.associate = (models) => {
        UserCer.hasMany(models.Users, { foreignKey: 'user_id' });
        UserCer.hasMany(models.Certificate, { foreignKey: 'cer_id' });
    };

    return UserCer
};