const router = require("express").Router();

router.use(
    "/department",
    require("./department.routes")
);

router.use(
    "/institutional",
    require("./institutional.routes")
);

router.use(
    "/citizen",
    require("./citizen.routes")
);

module.exports = router;