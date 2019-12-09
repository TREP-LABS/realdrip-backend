import mongoose from 'mongoose';

const { Schema } = mongoose;

const infusionSchema = new Schema({
  volumeToDispense: { type: Number, required: true },
  patientName: { type: String, required: true },
  doctorsInstruction: { type: String, required: true },
  status: { type: String, enum: ['active', 'ended'] },
  deviceId: { type: Schema.Types.ObjectId, required: true, ref: 'devices' },
  hospitalId: { type: Schema.Types.ObjectId, required: true, ref: 'user.hospitaladmin' },
  wardId: { type: Schema.Types.ObjectId, ref: 'user.ward' },
  nurseId: { type: Schema.Types.ObjectId, ref: 'user.nurse' },
});

export default mongoose.model('infusion', infusionSchema);
