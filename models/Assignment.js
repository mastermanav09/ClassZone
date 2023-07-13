const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    file: {
      type: String,
    },

    responses: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        file: {
          type: String,
          required: true,
        },
      },
    ],

    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", userSchema);

export default Assignment;
