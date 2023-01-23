const express = require("express");
const router = express.Router();
const wisataController = require("../controllers/wisataController");

router.get("/wisatas", wisataController.getAllWisata);
router.get("/wisata/:idWisata", wisataController.getOneWisata);
router.get("/wisata-newest", wisataController.newestWisata);
router.post("/wisata/:userID", wisataController.createWisata);
router.put("/wisata/:wisataID&:userID", wisataController.updateOneWisata);
router.delete("/wisata/:idWisata&:idUser", wisataController.deleteOneWisata);
router.delete("/wisata/user/:idUser", wisataController.deleteWisatabyUser);

module.exports = router;
