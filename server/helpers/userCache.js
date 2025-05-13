// const redis = require("../utils/redisClient");
// const User = require("../models/user");
// const logger = require("../utils/logger");

// // helpers/userCache.js
// const CACHE_TTL = 1800; // 30 mins

// async function getUserFromCacheOrDB(userId, { skipCache = false } = {}) {
//   const key = `user:${userId}`;

//   if (!skipCache) {
//     const raw = await redis.get(key);
//     if (raw) {
//       logger.info(`User ${userId} served from Redis`);
//       return JSON.parse(raw);
//     }
//   }

//   const user = await User.findById(userId).select("email credits");
//   if (!user) return null;

//   await redis.set(key, JSON.stringify(user), 'EX', CACHE_TTL);
//   logger.info(`User ${userId} fetched from DB and cached`);
//   return user;
// }

// function invalidateUserCache(userId) {
//   const key = `user:${userId}`;
//   return redis.del(key);
// }

// module.exports = { getUserFromCacheOrDB, invalidateUserCache };
