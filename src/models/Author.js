const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      required: true,
      trim: true,
    },
    writingGenre: {
      type: String,
      required: true,
      enum: ["Novel", "Poetry", "Fantasy", "Fiction", "Mystery", "Suspense"],
    },
  },
  {
    timestamps: true,
    collection: "Authors",
  }
);

module.exports = mongoose.model("Author", authorSchema);
