require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const sequelize = require("./config/database");
const app = require("./app");


const PORT = process.env.PORT || 5008;

(async () => {
    try {

        await sequelize.authenticate();
        await sequelize.sync();

        console.log(
            "✅ Database Connected Successfully"
        );

        app.listen(PORT, () => {
            console.log(
                `✅ Server running on port ${PORT}`
            );
        });

    } catch (err) {
        console.error(err);
    }
})();