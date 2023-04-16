import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

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

const User = mongoose.models.User || mongoose.model("Class", userSchema);

export default User;
