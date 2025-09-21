const { db, dbConfig, mysql } = require("../config/db.js")
const generateUUID = require("../utils/generateUUID.js");

const createDatabase = async () => {
  const tempDb = mysql();
  tempDb.config({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
  });

  try {
    await tempDb.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database '${dbConfig.database}' is ready.`);
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  } finally {
    await tempDb.end();
  }
};

const createTables = async () => {
  const userSql = `
    CREATE TABLE IF NOT EXISTS users(
      id VARCHAR(50) PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      age INT,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100),
      onboarding_complete BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      provider VARCHAR(50),
      provider_account_id VARCHAR(255)
    )
    `;

  const passResetSql = `
    CREATE TABLE IF NOT EXISTS password_resets(
      email VARCHAR(100) PRIMARY KEY,
      token VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    )
    `;

  await db.query(userSql);
  await db.query(passResetSql);
};

const findUserByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();
  const user = await db.query("SELECT * FROM users WHERE email = ?", [
    normalized,
  ]);

  return user[0];
};

const createUser = async (email, password, firstName, lastName) => {
  const id = generateUUID();

  const user = await db.query(
    "INSERT INTO users(id, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
    [id, email, password, firstName, lastName]
  );
  return user;
};

module.exports = { createDatabase, createTables, findUserByEmail, createUser };