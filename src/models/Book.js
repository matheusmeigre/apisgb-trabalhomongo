const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    synopsis: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    expectedReturnDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "Books",
  }
);

module.exports = mongoose.model("Book", bookSchema);
