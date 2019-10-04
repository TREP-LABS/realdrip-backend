import mongoose from 'mongoose';
import * as userTypes from './userTypes';

const { Schema } = mongoose;

const baseUser = {
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
  confirmed: { type: Boolean, required: true },
  deviceCount: { type: Number, required: true },
});

const wardUserSchema = new Schema({
  ...baseUser,
  defaultPass: { type: Boolean },
  hospitalId: { type: Schema.Types.ObjectId, required: true },
  deviceCount: { type: Number, required: true },
});

const nurseUserSchema = new Schema({
  ...baseUser,
  defaultPass: { type: Boolean },
  wardId: { type: Schema.Types.ObjectId, required: true },
  hospitalId: { type: Schema.Types.ObjectId, required: true },
});

export default {
  [userTypes.HOSPITAL_ADMIN_USER]: mongoose.model('user.hospitaladmin', hospitalAdminUserSchema),
  [userTypes.WARD_USER]: mongoose.model('user.ward', wardUserSchema),
  [userTypes.NURSE_USER]: mongoose.model('user.nurse', nurseUserSchema),
};
