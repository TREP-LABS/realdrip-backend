import mongoose from 'mongoose';

const { Schema } = mongoose;

const verifyDeviceSchema = new Schema({
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  dateVerified: {type: Date, required: true }
});

export default {
  verifyDeviceSchema,
};
