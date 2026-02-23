/**
 * Migration: Fix appointments with malformed createdBy values
 *
 * Run once from your project root:
 *   node fix-createdby-migration.js
 *
 * What it does:
 *   - Finds appointments where createdBy is an object (e.g. { "$oid": "..." })
 *     instead of a plain string
 *   - Rewrites them as plain strings
 *
 * After running this, new appointments will also save correctly because
 * the route now uses String(user.userId).
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

const db = mongoose.connection.db;
const collection = db.collection('appointments');

const all = await collection.find({}).toArray();
let fixed = 0;

for (const appt of all) {
  const raw = appt.createdBy;

  // Detect if createdBy is an object instead of a plain string
  if (raw !== null && typeof raw === 'object') {
    // JWT ObjectId may serialize as { "$oid": "..." } or a Mongoose ObjectId object
    const str = raw?.$oid || raw?.toString?.() || String(raw);
    await collection.updateOne({ _id: appt._id }, { $set: { createdBy: str } });
    console.log(`Fixed: ${appt._id} → createdBy = "${str}"`);
    fixed++;
  }
}

console.log(`\nDone. Fixed ${fixed} of ${all.length} appointments.`);
await mongoose.disconnect();
