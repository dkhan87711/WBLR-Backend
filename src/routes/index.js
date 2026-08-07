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

router.use(
    "/digipin",
    require("./digipin.routes"));

router.use(
    '/ulpin',
    require('./ulpin.routes'));

module.exports = router;