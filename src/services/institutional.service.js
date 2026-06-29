const userRepository =
    require("../repositories/user.repository");

const userSessionRepository =
    require("../repositories/userSession.repository");

const login = async (
    userName,
    email,
    password,
    loginType
) => {

    const user =
        await userRepository.findByUserNameOrEmail(
            userName,
            email
        );

    if (!user) {
        throw new Error(
            "User not found"
        );
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

    const session =
        await userSessionRepository.createSession({
            userId: user.userId,
            loginType
        });

    const userDetails =
        await userRepository.findUserWithDetails(
            user.userId
        );

    return {
        sessionId: session.sessionId,
        user: userDetails
    };

};

const logout = async (
    sessionId
) => {

    const session =
        await userSessionRepository.logoutSession(
            sessionId
        );

    if (!session) {
        throw new Error(
            "Session not found"
        );
    }

    return {
        sessionId:
            session.sessionId,
        message:
            "Logout successful"
    };

};

module.exports = {
    login,
    logout
};