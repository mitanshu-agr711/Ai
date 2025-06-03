import mongoose, { Schema, Document } from 'mongoose';
export interface IInterview extends Document {
  title: string;
  description: string;
  date: Date;
  practicedBy: mongoose.Types.ObjectId;
}

const interviewSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  practicedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});
export const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

