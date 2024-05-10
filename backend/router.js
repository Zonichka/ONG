const Router = require("express");
const router = new Router();
const controller = require("./controller");

router.post("/prompt", controller.getText.bind(controller));
router.post("/api", controller.getToken.bind(controller));

module.exports = router;