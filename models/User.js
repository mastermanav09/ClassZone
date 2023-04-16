import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    credentials: {
      name: {
        type: String,
        required: true,
        min: 3,
      },

      email: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
        min: 6,
      },

      role: {
        type: String,
        required: false,
      },

      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    },

    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
