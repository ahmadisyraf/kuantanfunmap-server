import { Router } from 'express';
import placeRouter from './place.route';

const mainRouter = Router();

mainRouter.use('/place', placeRouter);

export default mainRouter;
