import mongoose from 'mongoose';

const { Schema } = mongoose;

const deviceSchema = new Schema({
  hospitalId: { type: Schema.Types.ObjectId, required: true },
  wardId: { type: Schema.Types.ObjectId },
  label: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now(), required: true },
});

export default {
  deviceModel: mongoose.model('devices', deviceSchema),
};
