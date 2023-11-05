const mongoose = require("mongoose");
const Assignment = require("./Assignment");
const { colorValidator } = require("../utils/validators/colorValidator");
const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

    announcements: [
      {
        text: { type: String },
        createdAt: { type: Date },
        updatedAt: { type: Date },
        isPinned: { type: Boolean, default: false },
        isEdited: { type: Boolean, default: false },
      },
    ],

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
      },
    ],

    backgroundColor: {
      type: String,
      validator: [colorValidator, "Invalid Color"],
      required: true,
    },
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);

export default Class;
