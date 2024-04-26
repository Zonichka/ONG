const Router = require("express");
const router = new Router();
const controller = require("./controller");

router.post("/prompt", controller.getText);

module.exports = router;