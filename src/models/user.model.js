const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        userId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: "user_id"
        },

        firstName: {
            type: DataTypes.STRING(100),
            field: "first_name"
        },

        lastName: {
            type: DataTypes.STRING(100),
            field: "last_name"
        },

        userName: {
            type: DataTypes.STRING(100),
            field: "user_name"
        },

        // userTypeName: {
        //     type: DataTypes.STRING(50),
        //     field: "user_type_name"
        // },

        userTypeId: {
            type: DataTypes.INTEGER,
            field: "user_type_id"
        },

        email: {
            type: DataTypes.STRING(255),
            field: "email"
        },

        phoneNo: {
            type: DataTypes.STRING(20),
            field: "phone_no"
        },

        password: {
            type: DataTypes.STRING(255),
            field: "password"
        }
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = User;