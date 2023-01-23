const { validationResult } = require("express-validator");
const artikel = require("../models/artikelModel");
const user = require("../models/userModel");

const bcrypt = require("bcrypt");
const { authenticateGoogle, uploadToGoogleDrive } = require("../services/googleDriveServices");

exports.getAllArtikel = async (req, res) => {
  const artikels = await artikel
    .find()
    .select("-deskripsi")
    .populate("uploaderID", "nama")
    .catch((err) => res.status(500).json(err));
  const artikel_verified = artikels.filter(
    (artikel) => artikel.verified === true
  );
  return res.status(200).json(artikel_verified);
};

exports.getNewestArtikel = async (req, res) => {
  const artikels = await artikel
    .find()
    .select("-deskripsi")
    .limit(5)
    .sort("-createdAt")
    .populate("uploaderID", "nama")
    .catch((err) => res.status(500).json(err));
  console.log(artikels);
  const artikel_verified = artikels.filter(
    (artikel) => artikel.verified === true
  );
  return res.status(200).json(artikel_verified);
};

exports.createArtikel = async (req, res) => {
  const users = await user.findById(req.body.idUser);
  const data = { ...req.body };

  let artikelData = JSON.parse(data.artikel);
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    artikelData.image = response.data.id;
    deleteFile(req.file.path);
  } catch (err) {
    console.log(err);
  }

  if (users === null) return res.status(404).json("Data user tidak ada!");
  await artikel
    .create({
      ...req.body,
      uploaderID: users._id,
      verified: false,
    })
    .then((resp) => res.status(201).json(resp))
    .catch((err) => res.status(400).json(err));
};

// Done
exports.getOneArtikel = async (req, res) => {
  await artikel
    .findById(req.params.idArtikel)
    .populate("uploaderID", "nama")
    .then((resp) =>
      resp ? res.status(200).json(resp) : res.status(404).json(resp)
    )
    .catch((err) => res.status(500).json("Data gagal diambil"));
};

// Done
exports.updateOneArtikel = async (req, res) => {
  let id = req.params.idArtikel;
  const users = await user.findById(req.params.IdUser);
  if (users === null) return res.status(400).json("data user tidak ada!");
  await artikel
    .findByIdAndUpdate(id, { ...req.body })
    .then(() => res.status(200).json({ data_updated: req.body }))
    .catch((err) => res.status(500).json(err));
};

// Done
exports.deleteOneArtikel = async (req, res) => {
  const users = await user.findById(req.params.IdUser);
  if (users === null) return res.status(400).json("Data User tidak ada");

  await artikel
    .findOneAndDelete({
      _id: req.params.idArtikel,
      uploaderID: users._id,
    })
    .then((resp) => res.status(200).json(resp))
    .catch((err) => res.status(500).json("Data gagal dihapus"));
};

exports.deleteArtikelbyUser = async (req, res) => {
  const users = await user.findById(req.params.IdUser);
  if (users === null) return res.status(400).json("data user tidak ada!");

  await artikel
    .deleteMany({ uploaderID: users._id })
    .then((resp) => {
      resp.deletedCount === 0
        ? res.status(404).json("Data Postingan gagal dihapus")
        : res.status(200).json(resp);
    })
    .catch((err) => res.status(500).json("Data gagal dihapus"));
};
