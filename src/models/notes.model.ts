import { InferSchemaType, model, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, min: 5, max: 100, required: true },
    content: { type: String, min: 1, required: true },
  },
  {
    timestamps: true,
  }
);

export type INote = InferSchemaType<typeof noteSchema>;
export default model<INote>("Note", noteSchema);
