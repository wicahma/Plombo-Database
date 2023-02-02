const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { multer } = require("../middlewares/multerFileHandler");

router.get("/users", userController.getAllUser);
router.get("/user/:uname&:pass", userController.loginUser);
router.get("/user/username/:username", userController.getUsername);
router.get("/user/email/:email", userController.getEmail);
router.post("/user", userController.createUser);
router.delete("/user", userController.deleteUser);
router.put("/user/:id", userController.updateOneUser);
router.put("/user/image/:id", multer.single("gambar"), userController.updateImage);
router.put("/user/pass/:id", userController.updatePassword);

module.exports = router;
