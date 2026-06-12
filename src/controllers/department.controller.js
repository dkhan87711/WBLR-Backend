const departmentService =
    require("../services/department.service");

const login = async (req, res) => {
    try {

        const {
            userName,
            email,
            password
        } = req.body;

        const result =
            await departmentService.login(
                userName,
                email,
                password
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
    login
};