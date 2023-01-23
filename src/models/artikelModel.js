const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Done
const artikelSchema = new Schema(
  {
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
    judul: {
      type: String,
      required: true,
    },
    gambar: {
      type: String,
      required: true,
    },
    uploaderID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    deskripsi: {
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

module.exports = mongoose.model("artikel", artikelSchema);
