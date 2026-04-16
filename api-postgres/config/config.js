require('dotenv').config();

const dbConfig = {
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Esto permite la conexión segura con Aiven
    }
  }
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
