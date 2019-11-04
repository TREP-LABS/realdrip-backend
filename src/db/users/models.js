import mongoose from 'mongoose';
import * as userTypes from './userTypes';

const { Schema } = mongoose;

const baseUser = {
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
};

const hospitalAdminUserSchema = new Schema({
  ...baseUser,
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
  },
  confirmedEmail: { type: Boolean, required: true },
  verifiedPurchase: { type: Boolean, required: true },
});

hospitalAdminUserSchema.index({ email: true }, { background: false });

const wardUserSchema = new Schema({
  ...baseUser,
  label: { type: String },
  defaultPass: { type: Boolean },
  hospitalId: { type: Schema.Types.ObjectId, required: true },
});

wardUserSchema.index({ email: true }, { background: false });

const nurseUserSchema = new Schema({
  ...baseUser,
  defaultPass: { type: Boolean },
  phoneNo: { type: String },
  wardId: { type: Schema.Types.ObjectId, required: true },
  hospitalId: { type: Schema.Types.ObjectId, required: true },
});

nurseUserSchema.index({ email: true }, { background: false });

export default {
  [userTypes.HOSPITAL_ADMIN_USER]: mongoose.model('user.hospitaladmin', hospitalAdminUserSchema),
  [userTypes.WARD_USER]: mongoose.model('user.ward', wardUserSchema),
  [userTypes.NURSE_USER]: mongoose.model('user.nurse', nurseUserSchema),
};
