const { validationResult } = require("express-validator");
const artikel = require("../models/artikelModel");
const wisata = require("../models/wisataModel");
const komentar = require("../models/komentarModel");
const user = require("../models/userModel");

exports.getAllKomentar = async (req, res) => {
  await komentar
    .find()
    .populate("jenisID", ["namaTempat", "verified"])
    .populate("uploaderID", ["nama", "gambar"])
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json("Data komentar gagal diambil"));
};

exports.getKomentarByJenis = async (req, res) => {
  await komentar
    .find({ jenisID: req.params.jenisID })
    .populate("jenisID", ["namaTempat", "verified"])
    .populate("uploaderID", ["nama", "gambar"])
    .then((komentar) => res.status(200).json(komentar))
    .catch((err) => res.status(500).json("Data Komentar gagal diambil"));
};

exports.createKomentar = async (req, res) => {
  const users = await user.findById(req.body.uploaderID);
  const artikels = await artikel.findById(req.body.jenisID);
  const wisatas = await wisata.findById(req.body.jenisID);
  let jenis;

  if (users === null) return res.status(404).json("Data user tidak");
  if (artikels !== null) jenis = "artikel";
  if (wisatas !== null) jenis = "wisata";
  if (artikels === null && wisatas === null)
    return res.status(404).json("Data jenis tidak ada");

  await komentar
    .create({
      uploaderID: users._id,
      jenisID: req.body.jenisID,
      jenis: jenis,
      komentar: req.body.komentar,
    })
    .then((resp) => res.status(200).json(resp))
    .catch((err) => res.status(500).json("Data gagal dibuat!"));
};

exports.deleteOneKomentar = async (req, res) => {
  const users = await user.findById(req.params.idUser);
  if (users === null) return res.status(404).json("User tidak ada");
  
  await komentar
    .findOneAndDelete({
      _id: req.params.idKomentar,
      uploaderID: users._id,
    })
    .then((resp) => res.status(200).json("Data berhasil dihapus"))
    .catch((err) => res.status(500).json("Data gagal dibuat"));
};

exports.deleteKomentarbyUser = async (req, res) => {
  const users = await user.findById(req.params.idUser);
  if (users === null) return res.status(404).json("User tidak ada");

  await komentar
    .deleteMany({ uploaderID: users._id })
    .then((resp) => {
      resp.deletedCount === 0
        ? res.status(404).json("Data komentar gagal dihapus")
        : res.status(200).json(resp);
    })
    .catch((err) => res.status(404).json("Data Komentar gagal dihapus!"));
};
