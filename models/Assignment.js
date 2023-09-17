const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
    },

    responses: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        submittedFilePath: {
          type: String,
          required: true,
        },

        submittedOn: {
          type: Date,
          required: true,
        },

        comment: {
          type: String,
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
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default Assignment;
