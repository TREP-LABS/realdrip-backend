import mongoose from 'mongoose';

const { Schema } = mongoose;

const infusionSchema = new Schema({
  startVolume: { type: Number, required: true },
  stopVolume: { type: Number, required: true },
  patientName: { type: String, required: true },
  doctorsInstruction: { type: String, required: true },
  status: { type: String, enum: ['active', 'ended'] },
  deviceId: { type: Schema.Types.ObjectId, required: true },
  hospitalId: { type: Schema.Types.ObjectId, required: true },
  wardId: { type: Schema.Types.ObjectId },
  nurseId: { type: Schema.Types.ObjectId },
});

export default mongoose.model('infusion', infusionSchema);
