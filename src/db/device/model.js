import mongoose from 'mongoose';

const { Schema } = mongoose;

const deviceSchema = new Schema({
  /* ************** DEV COMMENT *****************
  Removed required from hospitalId and wardId
  because during sync the devices are unassigned.
  ********************************************* */
  hospitalId: { type: Schema.Types.ObjectId },
  wardId: { type: Schema.Types.ObjectId },
  label: { type: String, default: 'Default label' },
  fbDeviceId: { type: String, required: true },
});

export default mongoose.model('devices', deviceSchema);
