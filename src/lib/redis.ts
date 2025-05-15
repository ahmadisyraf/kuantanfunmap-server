import { createClient, SCHEMA_FIELD_TYPE } from 'redis';
import 'dotenv/config';

export async function initRedis() {
  const redis = createClient({ url: process.env.REDIS_URL });

  redis.on('error', (err) => console.error('Redis Error:', err));

  await redis.connect();

  try {
    await redis.ft.create(
      'idx:places',
      {
        '$.name': { type: SCHEMA_FIELD_TYPE.TEXT, AS: 'name' },
        '$.lat': { type: SCHEMA_FIELD_TYPE.NUMERIC, AS: 'lat' },
        '$.lng': { type: SCHEMA_FIELD_TYPE.NUMERIC, AS: 'lng' },
        '$.category': { type: SCHEMA_FIELD_TYPE.TAG, AS: 'category' },
        '$.slug': { type: SCHEMA_FIELD_TYPE.TEXT, AS: 'slug' },
        '$.createdAt': { type: SCHEMA_FIELD_TYPE.TEXT, AS: 'createdAt' },
      },
      {
        ON: 'JSON',
        PREFIX: 'place:',
      },
    );
    console.log('Index created.');
  } catch (e: any) {
    console.error(e.message);
  }

  return redis;
}
