import mongoose from 'mongoose';

const { Schema } = mongoose;

const infusionSchema = new Schema({
  startVolume: { type: String },
  stopVolume: { type: String },
  patientName: { type: String },
  doctorsInstruction: { type: String },
  status: { type: String },
  deviceId: { type: Schema.Types.ObjectId, required: true },
  hospitalId: { type: Schema.Types.ObjectId, required: true },
  wardId: { type: Schema.Types.ObjectId },
  nurseId: { type: Schema.Types.ObjectId },
});

export default mongoose.model('infusion', infusionSchema);
