import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "tutor", "admin"] },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

type IUser = InferSchemaType<typeof userSchema>;

export default model<IUser>("User", userSchema);
