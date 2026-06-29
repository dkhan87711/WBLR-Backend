const User = require("../models/user.model");
const { Op, QueryTypes } = require("sequelize");
const sequelize = require("../config/database");

/* =====================================================
   CREATE USER
===================================================== */

const createUser = async (payload) => {
    return await User.create(payload);
};

/* =====================================================
   LOGIN LOOKUP
===================================================== */

const findByUserNameOrEmail = async (
    userName,
    email
) => {

    const conditions = [];

    if (userName) {
        conditions.push({
            userName
        });
    }

    if (email) {
        conditions.push({
            email
        });
    }

    if (conditions.length === 0) {
        return null;
    }

    return await User.findOne({
        where: {
            [Op.or]: conditions
        }
    });

};

/* =====================================================
   USER DETAILS WITH ROLE + PERMISSIONS
===================================================== */

const findUserWithDetails = async (
    userId
) => {

    const query = `
        SELECT

            u.user_id,
            u.first_name,
            u.last_name,
            u.user_name,
            u.email,
            u.phone_no,
            u.password,

            ut.user_type_id,
            ut.user_type_name,

            ust.user_subtype_id,
            ust.subtype_code,
            ust.subtype_name,

            r.role_id,
            r.role_code,
            r.role_name,

            COALESCE(
                ARRAY_AGG(
                    DISTINCT rp.permission_code
                ) FILTER (
                    WHERE rp.permission_code IS NOT NULL
                ),
                '{}'
            ) AS permissions

        FROM users u

        JOIN user_types ut
            ON ut.user_type_id = u.user_type_id

        LEFT JOIN user_subtypes ust
            ON ust.user_subtype_id = u.user_subtype_id

        LEFT JOIN roles r
            ON r.role_id = u.role_id

        LEFT JOIN role_permissions rp
            ON rp.role_id = r.role_id

        WHERE u.user_id = :userId

        GROUP BY

            u.user_id,
            u.first_name,
            u.last_name,
            u.user_name,
            u.email,
            u.phone_no,
            u.password,

            ut.user_type_id,
            ut.user_type_name,

            ust.user_subtype_id,
            ust.subtype_code,
            ust.subtype_name,

            r.role_id,
            r.role_code,
            r.role_name
    `;

    const users =
        await sequelize.query(
            query,
            {
                replacements: {
                    userId
                },
                type: QueryTypes.SELECT
            }
        );

    if (!users.length) {
        return null;
    }

    const user = users[0];

    return {
        userId: user.user_id,
        userName: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNo: user.phone_no,
        password: user.password,

        userType: {
            id: user.user_type_id,
            name: user.user_type_name
        },

        userSubType: user.user_subtype_id
            ? {
                id: user.user_subtype_id,
                code: user.subtype_code,
                name: user.subtype_name
            }
            : null,

        role: user.role_id
            ? {
                id: user.role_id,
                code: user.role_code,
                name: user.role_name
            }
            : null,

        permissions:
            user.permissions || []
    };
};

/* =====================================================
   EXISTING USER CHECK
===================================================== */

const findExistingUser = async (
    userName,
    email,
    phoneNo
) => {

    const conditions = [];

    if (userName) {
        conditions.push({
            userName
        });
    }

    if (email) {
        conditions.push({
            email
        });
    }

    if (phoneNo) {
        conditions.push({
            phoneNo
        });
    }

    if (conditions.length === 0) {
        return null;
    }

    return await User.findOne({
        where: {
            [Op.or]: conditions
        }
    });

};

/* =====================================================
   PHONE SEARCH
===================================================== */

const findByPhoneNo = async (
    phoneNo
) => {

    return await User.findOne({
        where: {
            phoneNo
        }
    });

};

/* =====================================================
   USER BY ID
===================================================== */

const findByUserId = async (
    userId
) => {

    return await User.findByPk(
        userId
    );

};

/* =====================================================
   UPDATE USER
===================================================== */

const updateUser = async (
    userId,
    payload
) => {

    await User.update(
        payload,
        {
            where: {
                userId
            }
        }
    );

    return await findByUserId(
        userId
    );

};

/* =====================================================
   DELETE USER
===================================================== */

const deleteUser = async (
    userId
) => {

    return await User.destroy({
        where: {
            userId
        }
    });

};

module.exports = {
    createUser,
    findByUserNameOrEmail,
    findUserWithDetails,
    findExistingUser,
    findByPhoneNo,
    findByUserId,
    updateUser,
    deleteUser
};