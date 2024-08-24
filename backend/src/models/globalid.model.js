module.exports = (sequelize, DataTypes) => {

    const GlobalID = sequelize.define("globalId", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'GlobalID'
    }, {
        timestamps: true,
        createdAt: 'created_at', // Alias createdAt as created_at
        updatedAt: 'updated_at'  // Alias updatedAt as updated_at
    });

    GlobalID.associate = (models) => {
        GlobalID.belongsTo(models.Users, { foreignKey: 'user_id' });
    };

    return GlobalID
}