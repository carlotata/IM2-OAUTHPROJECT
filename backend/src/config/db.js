const mysql = require("serverless-mysql");

const dbConfig = {
  host: "localhost",
  database: "authen",
  user: "root",
  password: "",
  port: 3306,
};

const db = mysql({
  config: dbConfig,
});

module.exports = { db, dbConfig, mysql };