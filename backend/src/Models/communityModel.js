module.exports = (sequelize, DataTypes) => {

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
        }
    }, {
        tableName: 'Community'
    });

    return Community

}