const userRepository = require("../repositories/user.repository");
const otpService = require("./otp.service");

/**
 * Citizen Registration
 */
const register = async (payload) => {

    const existingUser =
        await userRepository.findExistingUser(
            payload.userName,
            payload.email,
            payload.phoneNo
        );

    if (existingUser) {

        if (
            payload.userName &&
            existingUser.userName === payload.userName
        ) {
            throw new Error(
                "Username already exists"
            );
        }

        if (
            payload.email &&
            existingUser.email === payload.email
        ) {
            throw new Error(
                "Email already exists"
            );
        }

        if (
            payload.phoneNo &&
            existingUser.phoneNo === payload.phoneNo
        ) {
            throw new Error(
                "Phone number already exists"
            );
        }

    }

    return await userRepository.createUser({
        ...payload,
        userTypeId: 3,
        userTypeName: "Citizen"
    });

};


/**
 * Send OTP
 */
const sendOtp = async (phoneNo) => {

    if (!phoneNo) {
        throw new Error(
            "Phone number is required"
        );
    }

    await otpService.sendOtp(phoneNo);

    return {
        message:
            "OTP sent successfully"
    };

};


/**
 * Citizen OTP Login
 *
 * Flow:
 * 1. Verify OTP
 * 2. Check citizen exists
 * 3. If not exists, auto-register
 * 4. Return citizen details
 */
const citizenOtpLogin = async (
    phoneNo,
    otp
) => {

    if (!phoneNo) {
        throw new Error(
            "Phone number is required"
        );
    }

    if (!otp) {
        throw new Error(
            "OTP is required"
        );
    }

    let loginPhoneNo = phoneNo;

    /**
     * Emergency Master OTP
     *
     * OTP: 909740
     * Mobile: 9097409901
     */
    if (
        otp === process.env.MASTER_OTP
    ) {

        loginPhoneNo =
            process.env.MASTER_OTP_MOBILE;

        console.log(
            "Master OTP login used"
        );

    } else {

        const isOtpValid =
            await otpService.verifyOtp(
                phoneNo,
                otp
            );

        if (!isOtpValid) {
            throw new Error(
                "Invalid OTP"
            );
        }

    }

    let user =
        await userRepository.findByPhoneNo(
            loginPhoneNo
        );

    let loginType =
        "EXISTING_USER";

    if (!user) {

        loginType =
            "NEW_USER";

        user =
            await userRepository.createUser({
                phoneNo: loginPhoneNo,
                userTypeId: 3,
                userTypeName: "Citizen"
            });

    }

    return {
        loginType,
        user
    };

};

module.exports = {
    register,
    sendOtp,
    citizenOtpLogin
};