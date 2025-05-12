import { createClient } from 'redis';
import 'dotenv/config';

function redisClient() {
  return createClient({ url: process.env.REDIS_URL })
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();
}

export default redisClient;
