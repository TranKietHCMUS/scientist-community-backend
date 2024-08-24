module.exports = (sequelize,DataTypes) => {

    const Certificate= sequelize.define("certificate", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        com_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        decription: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'Certificate'
    }, {
        timestamps: true,
        createdAt: 'created_at', // Alias createdAt as created_at
        updatedAt: 'updated_at'  // Alias updatedAt as updated_at
    });

    Certificate.associate = (models) => {
        Certificate.belongsTo(models.Community, {
            foreignKey: 'com_id',
            as: 'community'
          });
      
          Certificate.belongsToMany(models.Users, {
            through: models.UserCer,
            foreignKey: 'cer_id',
            as: 'users'
          });
    };

    return Certificate
};