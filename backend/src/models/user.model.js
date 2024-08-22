module.exports = (sequelize, DataTypes) => {

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
        avatar: {
            type:DataTypes.STRING
        },
        global_ID: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        createdAt: 'created_at', // Alias createdAt as created_at
        updatedAt: 'updated_at'  // Alias updatedAt as updated_at
    });

    return Users

}