import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  severity: { type: String, required: true },
  lesionType: { type: String, required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  reason: { type: String, required: true, maxlength: 1000 }
}, { timestamps: true });

export const Analysis = mongoose.model('Analysis', analysisSchema);
