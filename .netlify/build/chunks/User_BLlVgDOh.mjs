import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://modat_db_user:Mariammodat97@cluster0.pxizqba.mongodb.net/inventory-tracker?retryWrites=true&w=majority&appName=Cluster0";
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose2) => {
      return mongoose2;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    borrowedItems: [{
      type: Schema.Types.ObjectId,
      ref: "Item"
    }]
  },
  {
    timestamps: true
  }
);
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export { User as U, connectDB as c };
