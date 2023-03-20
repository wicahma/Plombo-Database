const express = require("express");
const router = express.Router();
const wisataController = require("../controllers/wisataController");
const { multer } = require("../middlewares/multerFileHandler");

router.get("/wisatas", wisataController.getAllWisata);
router.get("/wisatas/user/:idUser", wisataController.getAllWisatabyUser);
router.get("/wisatas/unverified/:idUser", wisataController.getUnverifiedWisata);
router.get("/wisata/:idWisata", wisataController.getOneWisata);
router.get("/wisata-newest", wisataController.newestWisata);
router.post("/wisata/:userID", multer.single("gambar"),wisataController.createWisata);
router.put("/wisata/:wisataID&:userID", wisataController.updateOneWisata);
router.delete("/wisata/:idWisata&:idUser", wisataController.deleteOneWisata);
router.delete("/wisata/user/:idUser", wisataController.deleteWisatabyUser);

module.exports = router;
