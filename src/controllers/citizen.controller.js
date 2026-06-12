const citizenService =
    require("../services/citizen.service");

/**
 * Citizen Registration
 */
const register = async (
    req,
    res
) => {

    try {

        const result =
            await citizenService.register(
                req.body
            );

        return res.status(201).json({
            success: true,
            data: result
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

};


/**
 * Send OTP
 */
const sendOtp = async (
    req,
    res
) => {

    try {

        const {
            phoneNo
        } = req.body;

        const result =
            await citizenService.sendOtp(
                phoneNo
            );

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

};


/**
 * OTP Login
 */
const citizenOtpLogin = async (
    req,
    res
) => {

    try {

        const {
            phoneNo,
            otp
        } = req.body;

        const result =
            await citizenService.citizenOtpLogin(
                phoneNo,
                otp
            );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    register,
    sendOtp,
    citizenOtpLogin
};