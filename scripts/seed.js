/**
 * scripts/seed-users.js
 *
 * Seeds the database with default users for every role.
 * Run with:  node scripts/seed-users.js
 *
 * Requirements:
 *   - MongoDB connection string in .env.local  (MONGODB_URI)
 *   - npm install dotenv bcryptjs mongoose
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load .env.local from project root
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// ─── Inline User schema (avoids import issues with Next.js models) ─────────
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin', 'doctor', 'nurse', 'staff'],
      required: true,
      default: 'user',
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ─── Seed data ─────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    username: 'admin',
    password: 'Admin@1234',
    role: 'admin',
    fullName: 'System Administrator',
    email: 'admin@nacare.clinic',
    isActive: true,
  },
  {
    username: 'dr.bekele',
    password: 'Doctor@1234',
    role: 'doctor',
    fullName: 'Dr. Bekele Tadesse',
    email: 'bekele@nacare.clinic',
    isActive: true,
  },
  {
    username: 'nurse.tigist',
    password: 'Nurse@1234',
    role: 'nurse',
    fullName: 'Tigist Haile',
    email: 'tigist@nacare.clinic',
    isActive: true,
  },
  {
    username: 'staff.samuel',
    password: 'Staff@1234',
    role: 'staff',
    fullName: 'Samuel Girma',
    email: 'samuel@nacare.clinic',
    isActive: true,
  },
  {
    username: 'testuser',
    password: 'User@1234',
    role: 'user',
    fullName: 'Test User',
    email: 'testuser@nacare.clinic',
    isActive: true,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌  MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅  Connected.\n');

  let created = 0;
  let skipped = 0;

  for (const seedUser of SEED_USERS) {
    const exists = await User.findOne({ username: seedUser.username });

    if (exists) {
      console.log(
        `⏭️   Skipped  [${seedUser.role.padEnd(6)}]  ${seedUser.username}  (already exists)`,
      );
      skipped++;
      continue;
    }

    const hashedPassword = bcrypt.hashSync(seedUser.password, 10);

    await User.create({
      ...seedUser,
      password: hashedPassword,
    });

    console.log(
      `✅  Created  [${seedUser.role.padEnd(6)}]  ${seedUser.username}  →  password: ${seedUser.password}`,
    );
    created++;
  }

  console.log(`\n📊  Done — ${created} created, ${skipped} skipped.\n`);

  // Print login table for reference
  if (created > 0) {
    console.log('─────────────────────────────────────────────────────');
    console.log(' Role    │ Username       │ Password');
    console.log('─────────────────────────────────────────────────────');
    for (const u of SEED_USERS) {
      console.log(
        ` ${u.role.padEnd(8)}│ ${u.username.padEnd(15)}│ ${u.password}`,
      );
    }
    console.log('─────────────────────────────────────────────────────');
    console.log(' ⚠️  Change all passwords after first login!\n');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
