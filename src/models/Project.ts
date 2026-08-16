import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  details?: string;
  images: string[];
  urlLink?: string;
  featured?: boolean;
  order?: number;
  created_at?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    details: { type: String, default: "" },
    images: { type: [String], default: [] },
    urlLink: { type: String, default: null },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  {
    // NÃO usa timestamps automático pois o banco já tem created_at (sem updatedAt)
    timestamps: false,
    // Aceita campos extras que existam no documento sem rejeitar
    strict: false,
  }
);

// Evita recompilação do model em dev (hot reload)
// "projects" é o nome exato da collection no seu Atlas
const Project: Model<IProject> =
  mongoose.models.projects ||
  mongoose.model<IProject>("projects", ProjectSchema);

export default Project;
