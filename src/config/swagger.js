const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bhu Manchitra API",
            version: "1.0.0",
            description: "Bhu Manchitra Backend Services"
        },
        servers: [
            {
                url: "http://localhost:5000" // ✅ IMPORTANT FIX
            }
        ]
    },

    // ✅ Ensure correct path
    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;