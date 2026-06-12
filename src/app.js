const express = require("express");
const cors = require("cors");

const swaggerUi =
    require("swagger-ui-express");

const swaggerSpec =
    require("./config/swagger");

const app = express();

/**
 * CORS Configuration
 */
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    })
);

/**
 * Parse JSON Request Body
 */
app.use(express.json());

/**
 * API Routes
 */
app.use(
    "/api",
    require("./routes")
);

/**
 * Swagger Documentation
 */
app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

module.exports = app;