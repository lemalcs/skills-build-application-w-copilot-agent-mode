import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'admin' | 'member' | 'coach';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  sport: string;
  focus: string;
  members: mongoose.Types.ObjectId[];
  captain: mongoose.Types.ObjectId;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  intensity: 'low' | 'moderate' | 'high';
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaderboard extends Document {
  userId: mongoose.Types.ObjectId;
  rank: number;
  points: number;
  streak: number;
  recentWins: number;
  updatedAt: Date;
}

export interface IWorkout extends Document {
  title: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  durationMinutes: number;
  targetAreas: string[];
  equipment: string[];
  focus: string;
  isRecommended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['admin', 'member', 'coach'], default: 'member' },
    fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    goals: [{ type: String, trim: true }],
    timezone: { type: String, default: 'UTC' },
  },
  { timestamps: true },
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    focus: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    captain: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, default: 'Remote' },
  },
  { timestamps: true },
);

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    distanceKm: { type: Number, min: 0 },
    intensity: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rank: { type: Number, required: true },
    points: { type: Number, required: true, default: 0 },
    streak: { type: Number, default: 0 },
    recentWins: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'leaderboard' },
);

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['easy', 'moderate', 'challenging'], required: true },
    durationMinutes: { type: Number, required: true, min: 5 },
    targetAreas: [{ type: String, trim: true }],
    equipment: [{ type: String, trim: true }],
    focus: { type: String, required: true, trim: true },
    isRecommended: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Team: Model<ITeam> = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
export const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
export const Leaderboard: Model<ILeaderboard> =
  mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
export const LeaderboardEntry = Leaderboard;
export const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);

export default {
  User,
  Team,
  Activity,
  Leaderboard,
  LeaderboardEntry,
  Workout,
};
