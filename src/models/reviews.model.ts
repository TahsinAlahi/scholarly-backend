import { InferSchemaType, Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, min: 5, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export type IReview = InferSchemaType<typeof reviewSchema>;

export default model<IReview>("Review", reviewSchema);
