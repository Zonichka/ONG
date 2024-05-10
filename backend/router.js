const Router = require("express");
const router = new Router();
const controller = require("./controller");

router.post("/prompt", controller.getText);
router.post("/api", controller.getToken);

module.exports = router;