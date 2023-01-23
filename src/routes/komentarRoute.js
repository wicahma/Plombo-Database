const express = require("express");
const router = express.Router();
const komentarController = require("../controllers/komentarController");

router.get("/komentars", komentarController.getAllKomentar);
router.get("/komentar/:jenisID", komentarController.getKomentarByJenis);
router.post("/komentar", komentarController.createKomentar);
router.delete("/komentar/:idKomentar&:idUser", komentarController.deleteOneKomentar);
router.delete("/komentar/user/:idUser", komentarController.deleteKomentarbyUser);

module.exports = router;
