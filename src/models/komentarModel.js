const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Done
const komentarSchema = new Schema(
  {
    jenisID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      refPath: "jenis",
    },
    jenis: {
      type: String,
      required: true,
      enum: ["wisata", "artikel"],
    },
    uploaderID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user",
    },
    komentar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("komentar", komentarSchema);
