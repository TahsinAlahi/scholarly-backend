import { InferSchemaType, model, Schema } from "mongoose";

export enum Status {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    rejectionReason: { type: String },
    isPaid: { type: Boolean, default: false },
    registrationFee: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export type ICourse = InferSchemaType<typeof courseSchema>;

export default model("Course", courseSchema);
