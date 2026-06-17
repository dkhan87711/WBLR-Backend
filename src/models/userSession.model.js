const { DataTypes } =
    require("sequelize");

const sequelize =
    require("../config/database");

const UserSession = sequelize.define(
    "UserSession",
    {
        sessionId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: "session_id"
        },

        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: "user_id"
        },

        loginType: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "login_type"
        },

        loginTime: {
            type: DataTypes.DATE,
            field: "login_time"
        },

        logoutTime: {
            type: DataTypes.DATE,
            field: "logout_time"
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            field: "is_active"
        }
    },
    {
        tableName: "user_sessions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = UserSession;