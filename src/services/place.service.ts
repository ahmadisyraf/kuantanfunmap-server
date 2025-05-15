import { eq } from 'drizzle-orm';
import { place as placeTable } from '../models/place.model';
import { db } from '../lib/db';
import { initRedis } from '../lib/redis';
import { PlaceType } from '../types/place';

async function getPlaces({ limit, page }: { limit: number; page: number }) {
  const redis = await initRedis();

  if (!limit) limit = 10;
  if (!page) page = 1;

  const offset = (page - 1) * limit;
  let places: PlaceType[] = [];

  type RedisQueryResult = {
    total: number;
    documents: Array<{
      id: string;
      value: PlaceType;
    }>;
  };

  const redisResult = (await redis.ft.search('idx:places', '*', {
    LIMIT: {
      from: offset,
      size: limit,
    },
    RETURN: 'slug',
  })) as unknown as RedisQueryResult;

  if (redisResult.documents.length < limit) {
    const placesFromDB = await db
      .select()
      .from(placeTable)
      .limit(limit)
      .offset(offset);

    places = placesFromDB as PlaceType[];

    await Promise.all(
      places.map((p) => redis.json.set(`place:${p.slug}`, '$', p as PlaceType)),
    );
  } else {
    places = redisResult.documents.map((doc) => doc.value);
  }

  return {
    data: places,
    count: places.length,
    page,
    limit,
  };
}

async function getPlaceBySlug(slug: string) {
  const redis = await initRedis();

  let place: PlaceType | Object = {};

  const placesFromRedis = await redis.json.get(`place:${slug}`);

  if (placesFromRedis && typeof placesFromRedis === 'string') {
    place = JSON.parse(placesFromRedis);
  }

  if (!placesFromRedis) {
    const placeFromDB = (await db
      .select()
      .from(placeTable)
      .where(eq(placeTable.slug, slug))) as unknown as PlaceType;

    place = placeFromDB;
  }

  return place;
}

export { getPlaces, getPlaceBySlug };
