import mongoose, { Schema, Document } from 'mongoose';
export interface IWorkspace extends Document {
  title: string;
  Interviews: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
}
const WorkspaceSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true, default: 'Untitled Workspace' },
  Interviews: [{ type: Schema.Types.ObjectId, ref: 'Interview' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,});
export const Workspace = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

// import mongoose, { Schema } from "mongoose";
// import { IWorkspace } from "../types/workspace.types.js";

// const workspaceSchema = new Schema<IWorkspace>(
//   {
//     name: {
//       type: String,
//       required: [true, "Workspace name is required"],
//       trim: true,
//       default: "Untitled Workspace"
//     },
//     owner: {
//       type: String,
//       required: [true, "Workspace owner is required"],
//       ref: "User"
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Create a compound index on owner and name to ensure unique workspace names per user
// workspaceSchema.index({ owner: 1, name: 1 }, { unique: true });

// // Create default "Untitled" workspace for new users
// workspaceSchema.statics.createDefaultWorkspace = async function(owner: string) {
//   try {
//     return await this.create({
//       name: "Untitled Workspace",
//       owner
//     });
//   } catch (error) {
//     throw new Error("Failed to create default workspace");
//   }
// };

// export const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);

