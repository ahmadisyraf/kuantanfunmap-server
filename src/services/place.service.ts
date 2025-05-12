import { eq } from 'drizzle-orm';
import { place } from '../models/place.model';
import { db } from '../utils/db';
import redisClient from '../utils/redis';

async function getPlaces() {
  const redis = await redisClient();
  const redisPlaces = await redis.get('place:all');

  if (redisPlaces) {
    return JSON.parse(redisPlaces);
  } else {
    const dbPlaces = await db.select().from(place);
    await redis.set('place:all', JSON.stringify(dbPlaces));

    return dbPlaces;
  }
}

async function getPlaceBySlug(slug: string) {
  const redis = await redisClient();
  const redisPlace = await redis.get(`place:${slug}`);

  if (redisPlace) {
    return JSON.parse(redisPlace);
  } else {
    const dbPlace = db.select().from(place).where(eq(place.slug, slug));
    await redis.set(`place:${slug}`, JSON.stringify(dbPlace), {
      expiration: {
        type: 'EX',
        value: 3600,
      },
    });

    return dbPlace;
  }
}

export { getPlaces, getPlaceBySlug };
