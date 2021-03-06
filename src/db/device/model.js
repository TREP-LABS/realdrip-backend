import mongoose from 'mongoose';

const { Schema } = mongoose;

const deviceSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, required: true },
  wardId: { type: Schema.Types.ObjectId },
  label: { type: String },
  fbDeviceId: { type: String },
});

export default mongoose.model('devices', deviceSchema);
