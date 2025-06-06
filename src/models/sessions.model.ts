import { InferSchemaType, model, Schema } from "mongoose";

export enum Status {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

const sessionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    tags: [String],
    rejectionReason: { type: String },
  },
  {
    timestamps: true,
  }
);

export type ISession = InferSchemaType<typeof sessionSchema>;

export default model("Session", sessionSchema);
