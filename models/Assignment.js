const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    file: {
      type: String,
    },
  },
  { timestamps: true }
);

const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", userSchema);

export default Assignment;
