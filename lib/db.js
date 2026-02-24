 import { createClient } from "@libsql/client/http";

const db = createClient({
  url: process.env.TURSO_URL || "https://banarasi-kamera-kamtatiwari.aws-ap-south-1.turso.io",
  authToken: process.env.TURSO_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE5MTEyODcsImlkIjoiZDA0OWY1ZmUtNThmMC00MTlhLWE5Y2YtMTZkZWM2NzIyNTg3IiwicmlkIjoiOWI4ODNlMGMtMTMwMC00ZmZiLWFjNjItOTFjMTk4NGFmMzUzIn0.WWV7fLLu-vB_f50nW_vQWPtFG6FwpPft6GPIUKUtRbcQNhJRqPVyt3ETEdby8mSdyi6s0BBMTwxDQUQ2TiNfAQ",
});

export async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      block_id INTEGER REFERENCES blocks(id),
      password TEXT NOT NULL,
      role TEXT DEFAULT 'activist',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workers (
      mobile TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      photo_url TEXT,
      age INTEGER,
      gender TEXT,
      caste TEXT,
      religion TEXT,
      block_id INTEGER REFERENCES blocks(id),
      village TEXT,
      skill TEXT,
      custom_skill TEXT,
      is_agricultural INTEGER DEFAULT 0,
      monthly_income INTEGER,
      land_bigha REAL DEFAULT 0,
      dependents INTEGER DEFAULT 0,
      children INTEGER DEFAULT 0,
      children_in_school INTEGER DEFAULT 0,
      wife_work TEXT,
      disease TEXT,
      is_migrant INTEGER DEFAULT 0,
      migrant_city TEXT,
      migrant_months INTEGER DEFAULT 0,
      migrant_season TEXT,
      migrant_work TEXT,
      has_aadhar INTEGER DEFAULT 0,
      has_labour_card INTEGER DEFAULT 0,
      has_ration_card INTEGER DEFAULT 0,
      has_ayushman INTEGER DEFAULT 0,
      has_bank_account INTEGER DEFAULT 0,
      has_jan_dhan INTEGER DEFAULT 0,
      registration_source TEXT DEFAULT 'self',
      activist_id INTEGER REFERENCES activists(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS worker_addictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_mobile TEXT REFERENCES workers(mobile),
      addiction_type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      video_url TEXT,
      pdf_url TEXT,
      author_id INTEGER REFERENCES activists(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER REFERENCES blog_posts(id),
      worker_mobile TEXT,
      name TEXT,
      content TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO blocks (id, name) VALUES
      (1, 'पिंडरा'),
      (2, 'काशी विद्यापीठ'),
      (3, 'अराजीलाइन'),
      (4, 'हरहुआ'),
      (5, 'चिरईगाँव'),
      (6, 'सेवापुरी'),
      (7, 'बड़ागाँव'),
      (8, 'चोलापुर');

    INSERT OR IGNORE INTO activists (id, name, mobile, role, password) VALUES
      (1, 'एडमिन', '9996865069', 'admin', '$2b$10$tmvaWUtXygEXrZrPg5uKtO64BJXcYdG2EDf2tUe7T3aT9TAG.U6vu');
  `);
}

export default db;