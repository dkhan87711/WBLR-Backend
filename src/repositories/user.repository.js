const User = require("../models/user.model");
const { Op } = require("sequelize");

const createUser = async (payload) => {
    return await User.create(payload);
};

const findByUserNameOrEmail = async (
    userName,
    email
) => {

    const conditions = [];

    if (userName) {
        conditions.push({ userName });
    }

    if (email) {
        conditions.push({ email });
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

const findExistingUser = async (
    userName,
    email,
    phoneNo
) => {

    const conditions = [];

    if (userName) {
        conditions.push({ userName });
    }

    if (email) {
        conditions.push({ email });
    }

    if (phoneNo) {
        conditions.push({ phoneNo });
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

const findByPhoneNo = async (
    phoneNo
) => {

    return await User.findOne({
        where: {
            phoneNo
        }
    });

};

const findByUserId = async (
    userId
) => {

    return await User.findByPk(
        userId
    );

};

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
    findExistingUser,
    findByPhoneNo,
    findByUserId,
    updateUser,
    deleteUser
};