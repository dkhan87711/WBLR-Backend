const UserSession =
    require("../models/userSession.model");

const createSession = async (
    payload
) => {

    return await UserSession.create(
        payload
    );

};

const logoutSession = async (
    sessionId
) => {

    await UserSession.update(
        {
            logoutTime: new Date(),
            isActive: false
        },
        {
            where: {
                sessionId
            }
        }
    );

    return await UserSession.findByPk(
        sessionId
    );

};

module.exports = {
    createSession,
    logoutSession
};