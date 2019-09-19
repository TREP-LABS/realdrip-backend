import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
  },
  password: { type: String, required: true },
  confirmed: { type: Boolean, required: true },
  deviceCount: { type: Number, required: true },
});

export default {
  AdminUserSchema,
};
