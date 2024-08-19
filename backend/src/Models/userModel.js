module.exports = (sequelize, Sequelize, DataTypes) => {

    const Users = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        day_of_birth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        about_me: {
            type: DataTypes.STRING
        },
        refresh_token: {
            type: DataTypes.STRING
        },
        verify_code: {
            type: DataTypes.STRING
        },
        is_verify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at' // Chỉ định tên trường trong DB là created_at
        },
            updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at' // Chỉ định tên trường trong DB là updated_at
        }
    });

    return Users

}