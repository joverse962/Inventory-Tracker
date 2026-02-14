import mongoose, { Schema } from 'mongoose';

const ComponentSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  condition: { type: String }
}, { _id: false });
const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["available", "borrowed", "used", "waste"],
      default: "available"
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true
    },
    image: {
      type: String
    },
    components: [ComponentSchema],
    borrowedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    borrowedAt: {
      type: Date
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);
ItemSchema.pre("save", function(next) {
  if (!this.barcode && this.isNew) {
    this.barcode = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});
const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

export { Item as I };
