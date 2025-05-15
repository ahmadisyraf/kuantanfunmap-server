import { Request, Response } from 'express';
import * as placeService from '../services/place.service';

async function getPlaces(req: Request, res: Response) {
  const { page, limit } = req.query;
  const places = await placeService.getPlaces({
    page: Number(page),
    limit: Number(limit),
  });

  res.json(places).status(200);
}

async function getPlacesBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const place = await placeService.getPlaceBySlug(slug);

  res.json(place).status(200);
}

export { getPlaces, getPlacesBySlug };