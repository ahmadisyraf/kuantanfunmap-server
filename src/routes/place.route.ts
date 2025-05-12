import { Router } from 'express';
import { getPlaces, getPlacesBySlug } from '../controllers/place.controller';

const placeRouter = Router();

placeRouter.get('/', getPlaces);
placeRouter.get('/:slug', getPlacesBySlug);

export default placeRouter;
