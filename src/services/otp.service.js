const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = async (
    phoneNo
) => {

    return await client.verify.v2
        .services(
            process.env.TWILIO_VERIFY_SERVICE_SID
        )
        .verifications
        .create({
            to: `+91${phoneNo}`,
            channel: "sms"
        });

};

const verifyOtp = async (
    phoneNo,
    otp
) => {

    const result =
        await client.verify.v2
            .services(
                process.env.TWILIO_VERIFY_SERVICE_SID
            )
            .verificationChecks
            .create({
                to: `+91${phoneNo}`,
                code: otp
            });

    return result.status === "approved";
};

module.exports = {
    sendOtp,
    verifyOtp
};