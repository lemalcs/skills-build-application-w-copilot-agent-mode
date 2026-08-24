"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
    const results = await models_1.User.find().sort({ createdAt: 1 }).lean();
    res.json({
        baseUrl: apiBaseUrl,
        count: results.length,
        results,
    });
});
app.get('/api/teams/', async (_req, res) => {
    const results = await models_1.Team.find().populate('members').populate('captain').sort({ createdAt: 1 }).lean();
    res.json({
        baseUrl: apiBaseUrl,
        count: results.length,
        results,
    });
});
app.get('/api/activities/', async (_req, res) => {
    const results = await models_1.Activity.find().populate('userId').sort({ date: -1 }).lean();
    res.json({
        baseUrl: apiBaseUrl,
        count: results.length,
        results,
    });
});
app.get('/api/leaderboard/', async (_req, res) => {
    const results = await models_1.Leaderboard.find().populate('userId').sort({ rank: 1 }).lean();
    res.json({
        baseUrl: apiBaseUrl,
        count: results.length,
        results,
    });
});
app.get('/api/workouts/', async (_req, res) => {
    const results = await models_1.Workout.find().sort({ createdAt: 1 }).lean();
    res.json({
        baseUrl: apiBaseUrl,
        count: results.length,
        results,
    });
});
async function startServer() {
    await (0, database_1.connectDatabase)();
    app.listen(port, () => {
        console.log(`Octofit Tracker API running at ${apiBaseUrl}`);
        console.log(`Listening on port ${port}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
exports.default = app;
