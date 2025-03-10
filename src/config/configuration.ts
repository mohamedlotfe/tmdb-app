// import { registerAs } from '@nestjs/config';

// export default registerAs('app', (): Record<string, any> => ({
//     env: process.env.NODE_ENV,
//     port: parseInt(process.env.PORT, 10) || 8080,
//     tmdb: {
//       apiKey: process.env.TMDB_API_KEY,
//       language: process.env.TMDB_LANGUAGE,
//     },
//     database: {
//       host: process.env.DB_HOST,
//       port: parseInt(process.env.DB_PORT, 10),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       name: process.env.DB_NAME,
//     },
//     auth: {
//       jwtSecret: process.env.JWT_SECRET,
//       jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10),
//     },
//     redis: {
//       host: process.env.REDIS_HOST,
//       port: parseInt(process.env.REDIS_PORT, 10),
//     },
//     cron: {
//       syncPattern: process.env.SYNC_CRON_PATTERN,
//     },
//   }),
// );
