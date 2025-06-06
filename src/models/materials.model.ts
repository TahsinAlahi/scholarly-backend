import { InferSchemaType, model, Schema } from "mongoose";

export enum ContentType {
  LINK = "link",
  NOTE = "note",
}

const materialsSchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    uploader: { type: Schema.Types.ObjectId, red: "User", required: true },
    title: { type: String, min: 5, max: 50, required: true },
    contentType: {
      type: String,
      enum: Object.values(ContentType),
      default: ContentType.NOTE,
    },
    fileUrl: { type: String },
    noteContent: { type: String },
  },
  {
    timestamps: true,
  }
);

materialsSchema.pre("validate", function (next) {
  if (this.contentType === ContentType.NOTE && !this.noteContent) {
    next(new Error("Note content is required"));
  }
  if (this.contentType === ContentType.LINK && !this.fileUrl) {
    next(new Error("File URL is required"));
  }

  next();
});

export type IMaterial = InferSchemaType<typeof materialsSchema>;

export default model<IMaterial>("Material", materialsSchema);
