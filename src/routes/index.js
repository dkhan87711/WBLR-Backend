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

router.use(
    "/approval",
    require("./approval.routes"));

module.exports = router;