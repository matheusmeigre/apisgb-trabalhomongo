const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    book: {
      type: String,
      required: true,
      trim: true,
    },
    loanDate: {
      type: String,
      required: true,
    },
    returnDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Loans",
  }
);

module.exports = mongoose.model("Loan", loanSchema);
