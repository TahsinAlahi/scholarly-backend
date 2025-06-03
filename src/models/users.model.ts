import { Schema, model, InferSchemaType, Document } from "mongoose";
import bcrypt from "bcrypt";

type IUserDocument = InferSchemaType<typeof userSchema>;

interface IUser extends IUserDocument, Document {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
    image: { type: String },
    createdAt: { type: Date, default: Date.now, immutable: true },
  },
  {
    timestamps: true,
    methods: {
      comparePassword: async function (password: string) {
        return await bcrypt.compare(password, this.password);
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this as Document & IUserDocument;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// userSchema.methods.comparePassword = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };

export default model<IUser>("User", userSchema);
