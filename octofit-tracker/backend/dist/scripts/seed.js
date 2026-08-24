"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const models_1 = require("../models");
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('Seed the octofit_db database with test data');
        await Promise.all([
            models_1.User.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.Activity.deleteMany({}),
            models_1.Leaderboard.deleteMany({}),
            models_1.Workout.deleteMany({}),
        ]);
        const users = await models_1.User.insertMany([
            {
                name: 'Ada Lovelace',
                email: 'ada.lovelace@example.com',
                passwordHash: 'hashedAda',
                role: 'admin',
                fitnessLevel: 'advanced',
                goals: ['Run a half marathon', 'Improve mobility', 'Lead team challenges'],
                timezone: 'UTC',
            },
            {
                name: 'Grace Hopper',
                email: 'grace.hopper@example.com',
                passwordHash: 'hashedGrace',
                role: 'member',
                fitnessLevel: 'intermediate',
                goals: ['Increase weekly mileage', 'Build strength', 'Stay consistent'],
                timezone: 'America/New_York',
            },
            {
                name: 'Linus Torvalds',
                email: 'linus.torvalds@example.com',
                passwordHash: 'hashedLinus',
                role: 'member',
                fitnessLevel: 'advanced',
                goals: ['Train for 10K', 'Recover faster', 'Increase endurance'],
                timezone: 'Europe/Helsinki',
            },
            {
                name: 'Margaret Hamilton',
                email: 'margaret.hamilton@example.com',
                passwordHash: 'hashedMargaret',
                role: 'coach',
                fitnessLevel: 'advanced',
                goals: ['Coach team progress', 'Track recovery metrics', 'Develop plans'],
                timezone: 'America/Los_Angeles',
            },
        ]);
        const createdTeams = await models_1.Team.insertMany([
            {
                name: 'Night Owls',
                sport: 'Running',
                focus: 'Endurance and consistency',
                members: [users[0]._id, users[1]._id],
                captain: users[0]._id,
                location: 'Remote',
            },
            {
                name: 'Code Crushers',
                sport: 'Strength',
                focus: 'Power and recovery',
                members: [users[2]._id, users[3]._id],
                captain: users[3]._id,
                location: 'Hybrid',
            },
        ]);
        await models_1.Activity.insertMany([
            {
                userId: users[0]._id,
                type: 'Run',
                durationMinutes: 42,
                caloriesBurned: 420,
                distanceKm: 7.8,
                intensity: 'high',
                date: new Date('2026-08-10T06:30:00Z'),
                notes: 'Morning tempo run with a strong finish.',
            },
            {
                userId: users[1]._id,
                type: 'Cycling',
                durationMinutes: 55,
                caloriesBurned: 500,
                distanceKm: 18.4,
                intensity: 'moderate',
                date: new Date('2026-08-11T18:00:00Z'),
                notes: 'Steady effort on a hilly route.',
            },
            {
                userId: users[2]._id,
                type: 'Strength',
                durationMinutes: 50,
                caloriesBurned: 390,
                intensity: 'high',
                date: new Date('2026-08-12T17:15:00Z'),
                notes: 'Focused on deadlifts and core stability.',
            },
            {
                userId: users[3]._id,
                type: 'Mobility',
                durationMinutes: 25,
                caloriesBurned: 140,
                intensity: 'low',
                date: new Date('2026-08-13T07:15:00Z'),
                notes: 'Recovery session with stretching and breathing drills.',
            },
        ]);
        await models_1.Leaderboard.insertMany([
            {
                userId: users[0]._id,
                rank: 1,
                points: 1520,
                streak: 12,
                recentWins: 4,
            },
            {
                userId: users[1]._id,
                rank: 2,
                points: 1410,
                streak: 9,
                recentWins: 3,
            },
            {
                userId: users[2]._id,
                rank: 3,
                points: 1365,
                streak: 7,
                recentWins: 2,
            },
            {
                userId: users[3]._id,
                rank: 4,
                points: 1295,
                streak: 6,
                recentWins: 2,
            },
        ]);
        await models_1.Workout.insertMany([
            {
                title: 'HIIT Cardio Blast',
                difficulty: 'moderate',
                durationMinutes: 25,
                targetAreas: ['cardio', 'legs', 'core'],
                equipment: ['mat', 'timer'],
                focus: 'Increase heart rate and stamina',
                isRecommended: true,
            },
            {
                title: 'Core Stability Circuit',
                difficulty: 'easy',
                durationMinutes: 20,
                targetAreas: ['core', 'glutes'],
                equipment: ['mat'],
                focus: 'Improve balance and posture',
                isRecommended: true,
            },
            {
                title: 'Strength Builder',
                difficulty: 'challenging',
                durationMinutes: 35,
                targetAreas: ['upper body', 'lower body'],
                equipment: ['dumbbells', 'bench'],
                focus: 'Build power and conditioning',
                isRecommended: false,
            },
        ]);
        console.log('Database seeding complete');
        console.log(`Inserted ${users.length} users, ${createdTeams.length} teams, 4 activities, 4 leaderboard entries, and 3 workouts.`);
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
}
seedDatabase();
