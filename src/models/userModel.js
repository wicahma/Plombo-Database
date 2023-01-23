const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Done
const userSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    kelamin: {
      type: String,
      required: true,
      enum: ["laki-laki", "perempuan"],
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      bcript: true,
      rounds: 10,
    },
    deskripsi: {
      type: String,
      required: false,
    },
    gambar: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(require("mongoose-bcrypt"));

module.exports = mongoose.model("user", userSchema);
