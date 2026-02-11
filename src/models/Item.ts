import mongoose, { Schema, type Document } from 'mongoose';

export interface IComponent {
  name: string;
  quantity: number;
  condition?: string;
}

export interface IItem extends Document {
  name: string;
  description: string;
  category: string;
  location: string;
  status: 'available' | 'borrowed' | 'used' | 'waste';
  barcode?: string;
  image?: string;
  components?: IComponent[];
  borrowedBy?: mongoose.Types.ObjectId;
  borrowedAt?: Date;
  quantity: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComponentSchema = new Schema<IComponent>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  condition: { type: String },
}, { _id: false });

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'borrowed', 'used', 'waste'],
      default: 'available',
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
    },
    components: [ComponentSchema],
    borrowedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    borrowedAt: {
      type: Date,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate barcode if not provided
ItemSchema.pre('save', function (next) {
  if (!this.barcode && this.isNew) {
    this.barcode = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

export const Item = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
