require('dotenv').config();//instatiate environment variables

export const CONFIG = {
  app: process.env.APP || 'dev',
  port: process.env.PORT || 3000,
  db_dialect: process.env.DB_DIALECT || 'mysql',
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || 3306,
  db_name: process.env.DB_NAME || 'name',
  db_user: process.env.DB_USER || 'root',
  db_password: process.env.DB_PASSWORD || 'db-password',
  jwt_encryption: process.env.JWT_ENCRYPTION || 'jwt_please_change',
  jwt_expiration: process.env.JWT_EXPIRATION || 10000
} // Make this global to use all over the application
    