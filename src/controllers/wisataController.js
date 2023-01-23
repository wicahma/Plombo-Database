const { validationResult } = require("express-validator");
const wisata = require("../models/wisataModel");
const user = require("../models/userModel");

exports.getAllWisata = async (req, res) => {
  const wisatas = await wisata.find().populate("uploaderID", "nama");
  const wisata_verified = wisatas.filter((wisata) => wisata.verified === true);
  return res.status(200).json(wisata_verified);
};

exports.newestWisata = async (req, res, next) => {
  const wisatas = await wisata
    .find()
    .limit(5)
    .sort("-createdAt")
    .populate("uploaderID", "nama");
  const wisata_verified = wisatas.filter((wisata) => wisata.verified === true);
  return await res.status(200).json(wisata_verified);
};

exports.createWisata = async (req, res) => {
  const users = await user.findById(req.params.userID);
  if (users === null) return res.status(404).json("Data user tidak ada!");

  await wisata
    .create({
      ...req.body,
      uploaderID: users._id,
      verified: false,
    })
    .then((resp) => res.status(201).json(resp))
    .catch((err) => res.status(500).json("Data wisata gagal dibuat!"));
};

exports.getOneWisata = async (req, res) => {
  await wisata
    .findById(req.params.idWisata)
    .populate("uploaderID", "nama")
    .then((resp) => {
      resp
        ? res.status(200).json(resp)
        : res.status(404).json("Data wisata tidak ada!");
    })
    .catch((err) => res.status(404).json("Data wisata gagal diambil!"));
};

exports.updateOneWisata = async (req, res) => {
  const users = await user.findById(req.params.userID);
  if (users === null) return res.status(404).json("Data user tidak ada!");

  let idWisata = req.params.wisataID;

  await wisata
    .findByIdAndUpdate(idWisata, { ...req.body })
    .then((resp) => res.status(200).json({ updated_at: req.body }))
    .catch((err) => res.status(500).json("data gagal diupdate"));
};

exports.deleteOneWisata = async (req, res) => {
  let id = req.params.idWisata;
  let idUser = req.params.idUser;
  const users = await user.findById(idUser);
  if (users === null) return res.status(404).json("User tidak ada!");

  await wisata
    .findOneAndDelete({ _id: id })
    .then((resp) => res.status(200).json("Data deleted!"))
    .catch((err) => res.status(500).json("Data user gagal dihapus!"));
};

exports.deleteWisatabyUser = async (req, res) => {
  const id = req.params.idUser;

  const users = await user.findById(id);
  if (users === null) return res.status(404).json("User tidak ada!");

  await wisata
    .deleteMany({ uploaderID: users._id })
    .then((resp) => {
      resp.deletedCount === 0
        ? res.status(404).json(`Data dengan ID user ${id} tidak ada!`)
        : res.status(200).json(resp);
    })
    .catch((err) => res.status(404).json("data Wisata gagal dihapus!"));
};
