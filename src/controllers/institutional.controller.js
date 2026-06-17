const institutionalService =
    require("../services/institutional.service");

const login = async (
    req,
    res
) => {

    try {

        const {
            userName,
            email,
            password,
            loginType
        } = req.body;

        const result =
            await institutionalService.login(
                userName,
                email,
                password,
                loginType
            );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

const logout = async (
    req,
    res
) => {

    try {

        const {
            sessionId
        } = req.body;

        const result =
            await institutionalService.logout(
                sessionId
            );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    login,
    logout
};