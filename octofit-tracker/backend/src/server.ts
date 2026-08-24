import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDatabase } from './config/database';
import { Activity, Leaderboard, Team, User, Workout } from './models';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const host = '0.0.0.0';

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'Octofit Tracker API',
    status: 'online',
    baseUrl: apiBaseUrl,
    routes: [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/',
    ],
  });
});

app.get('/api/users/', async (_req, res) => {
  const results = await User.find().sort({ createdAt: 1 }).lean();
  res.json({
    baseUrl: apiBaseUrl,
    count: results.length,
    results,
  });
});

app.get('/api/teams/', async (_req, res) => {
  const results = await Team.find().populate('members').populate('captain').sort({ createdAt: 1 }).lean();
  res.json({
    baseUrl: apiBaseUrl,
    count: results.length,
    results,
  });
});

app.get('/api/activities/', async (_req, res) => {
  const results = await Activity.find().populate('userId').sort({ date: -1 }).lean();
  res.json({
    baseUrl: apiBaseUrl,
    count: results.length,
    results,
  });
});

app.get('/api/leaderboard/', async (_req, res) => {
  const results = await Leaderboard.find().populate('userId').sort({ rank: 1 }).lean();
  res.json({
    baseUrl: apiBaseUrl,
    count: results.length,
    results,
  });
});

app.get('/api/workouts/', async (_req, res) => {
  const results = await Workout.find().sort({ createdAt: 1 }).lean();
  res.json({
    baseUrl: apiBaseUrl,
    count: results.length,
    results,
  });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, host, () => {
    console.log(`Octofit Tracker API running at ${apiBaseUrl}`);
    console.log(`Listening on ${host}:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
