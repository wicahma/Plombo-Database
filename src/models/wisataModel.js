const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Done
const wisataSchema = new Schema(
  {
    namaTempat: {
      type: String,
      required: true,
    },
    jenisWisata: {
      type: String,
      required: true,
      enum: [
        "Pantai",
        "Gunung/Bukit",
        "Pulau",
        "Air Terjun",
        "Tempat Bersejarah",
        "Lainnya",
      ],
    },
    lokasi: {
      type: String,
      required: true,
    },
    biaya: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    waktuTempuh: {
      type: Number,
      required: false,
    },
    uploaderID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user",
    },
    lokasiGIS: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    gambar: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("wisata", wisataSchema);
