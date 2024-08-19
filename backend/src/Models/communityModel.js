module.exports = (sequelize, Sequelize,DataTypes) => {

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
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at' // Chỉ định tên trường trong DB là created_at
        },
            updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at' // Chỉ định tên trường trong DB là updated_at
        }
    }, {
        tableName: 'Community'
    });

    return Community

}