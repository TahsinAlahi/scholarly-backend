import { InferSchemaType, Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentStatus: { type: String, enum: ["paid", "free"], default: "free" },
    bookedAt: { type: Date, default: Date.now, immutable: true },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  }
);

export type IBooking = InferSchemaType<typeof bookingSchema>;

export default model<IBooking>("Booking", bookingSchema);
