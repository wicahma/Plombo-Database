const { validationResult } = require("express-validator");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  authenticateGoogle,
  uploadToGoogleDrive,
} = require("../services/googleDriveServices");
const { deleteFile } = require("../middlewares/multerFileHandler");

// Done
exports.getAllUser = async (req, res) => {
  await user
    .find()
    .then((resp) => res.status(200).json(resp))
    .catch((err) => res.status(404).json(err));
};

exports.getUsername = async (req, res) => {
  console.log(req.params.username);
  const users = await user.find({
    username: req.params.username,
  });
  if (users.length > 0)
    return res
      .status(400)
      .json("Username sudah digunakan, silahkan gunakan username lain!");
  return res.status(200).json("Username bisa digunakan!");
};

exports.getEmail = async (req, res) => {
  console.log(req.params.email);
  const users = await user.find({
    email: req.params.email,
  });
  if (users.length > 0)
    return res
      .status(400)
      .json("Email sudah digunakan, silahkan gunakan username lain!");
  return res.status(200).json("Email bisa digunakan!");
};

// Done
exports.createUser = async (req, res) => {
  const users = await user.find({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (users.length > 0)
    return res.status(404).json("Email sudah pernah digunakan");

  await user
    .create({
      ...req.body,
      type: "user",
      deskripsi: "",
      gambar: "",
    })
    .then((resp) => res.status(200).json(resp))
    .catch((err) => res.status(500).json(err));
};

// Done
exports.loginUser = async (req, res) => {
  await user
    .findOne({
      $or: [{ username: req.params.uname }, { email: req.params.uname }],
    })

    .then((user) => {
      console.log(user);
      bcrypt.compare(req.params.pass, user.password).then((response) => {
        response ? res.status(200).json(user) : res.status(404).json(null);
      });
    })
    .catch((err) => res.status(500).json(err));
};

exports.deleteUser = async (req, res) => {
  await user
    .findOneAndDelete({ _id: req.body.id, email: req.body.email })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(400).json("Data User tidak ada");
      }
    })
    .catch((err) => res.status(200).json("Data User gagal dihapus"));
};

exports.updateOneUser = async (req, res) => {
  await user
    .findByIdAndUpdate(req.params.id, { ...req.body })
    .then((resp) =>
      res.status(200).json({ message: "Data berhasil diupdate " })
    )
    .catch((err) => res.status(500).json("Data gagal dipudate"));
};

exports.updateImage = async (req, res) => {
  const auth = authenticateGoogle();
  console.log(req.file);
  let response;
  const users = await user.findById(req.params.id);
  if (users === null) return res.status(404).json("Data user tidak ada!");

  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    response = await uploadToGoogleDrive(
      req.file,
      auth,
      process.env.USER_IMAGE_FILE_ID
    );
    deleteFile(req.file.path);
  } catch (err) {
    console.log(err);
  }
  await user
    .findByIdAndUpdate(req.params.id, { gambar: response.data.id })
    .then((resp) =>
      res.status(200).json({ message: "Data berhasil diupdate" })
    )
    .catch((err) =>
      res.status(500).json({ message: "Data gagal dipudate", err: err })
    );
};

exports.updatePassword = async (req, res) => {
  await user
    .findById(req.params.id)
    .then((data) => {
      bcrypt.compare(req.body.oldPassword, data.password).then((response) => {
        response
          ? user
              .findByIdAndUpdate(req.params.id, {
                password: req.body.password,
              })
              .then((resp) =>
                res.status(200).json({ updated_at: resp.updatedAt })
              )
              .catch((err) => res.status(500).json("Data pass gagal diupdate"))
          : res.status(401).json("Password lama salah !");
      });
    })
    .catch((err) => res.status(401).json("ID tidak ditemukan!"));
};
