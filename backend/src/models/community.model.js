module.exports = (sequelize,DataTypes) => {

    const Community= sequelize.define("community", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        decription: {
            type: DataTypes.STRING
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rate: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'Community'
    }, {
        timestamps: true,
        createdAt: 'created_at', // Alias createdAt as created_at
        updatedAt: 'updated_at'  // Alias updatedAt as updated_at
    });

    Community.associate = (models) => {
        Community.hasMany(models.Certificate, {
            foreignKey: 'com_id',
            as: 'certificate'
          });
    };

    return Community
};