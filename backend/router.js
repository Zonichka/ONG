const Router = require("express");
const router = new Router();
const controller = require("./controller");

router.post("/prompt", controller.getText.bind(controller));
router.post("/api", controller.getToken.bind(controller));
router.post("/menu/easy", controller.makeTextEasy.bind(controller));
router.post("/menu/finish", controller.finishText.bind(controller));
router.post("/menu/fix", controller.fixText.bind(controller));
router.post("/menu/mainthemes", controller.mainThemesText.bind(controller));
router.post("/menu/explanation", controller.explanationsText.bind(controller));
router.post("/menu/tooptions", controller.toOptionsOfContentText.bind(controller));
router.post("/menu/style", controller.changeStyleText.bind(controller));

module.exports = router;