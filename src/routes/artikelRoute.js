const express = require("express");
const router = express.Router();
const artikelController = require("../controllers/artikelController");
const { multer } = require("../middlewares/multerFileHandler");

router.get("/artikels", artikelController.getAllArtikel);
router.get("/artikels/user/:idUser", artikelController.getAllArtikelbyUser);
router.get("/artikels/unverified/:idUser", artikelController.getUnverifiedArtikel);
router.get("/artikel/newest-artikel", artikelController.getNewestArtikel);
router.get("/artikel/:idArtikel", artikelController.getOneArtikel);
router.post("/artikel", multer.single("gambar"),artikelController.createArtikel);
router.put("/artikel/:idArtikel&:IdUser", artikelController.updateOneArtikel);
router.delete("/artikel/:idArtikel&:IdUser", artikelController.deleteOneArtikel);
router.delete("/artikel/user/:IdUser", artikelController.deleteArtikelbyUser);

module.exports = router;
