import mongoose from "mongoose";
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
        date: { type: Date },
      },
    ],

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);

export default Class;
