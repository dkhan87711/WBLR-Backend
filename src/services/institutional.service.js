const userRepository = require("../repositories/user.repository");

const login = async (
    userName,
    email,
    password
) => {

    const user =
        await userRepository.findByUserNameOrEmail(
            userName,
            email
        );

    if (!user) {
        throw new Error("User not found");
    }

    if (user.userTypeId !== 2) {
        throw new Error(
            "Invalid Institutional User"
        );
    }

    if (user.password !== password) {
        throw new Error(
            "Invalid Password"
        );
    }

    return {
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        userTypeId: user.userTypeId,
        userTypeName: user.userTypeName,
        email: user.email
    };
};

module.exports = {
    login
};