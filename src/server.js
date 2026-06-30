require("dotenv").config();

const sequelize = require("./config/database");
const app = require("./app");

const PORT = process.env.PORT || 5000;

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