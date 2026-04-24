import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  updateRestaurantStatus,
  uploadRestaurantPhotos,
  deleteRestaurant
} from '../controllers/restaurant.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', createRestaurant);
router.put('/:id', updateRestaurant);
router.patch('/:id/status', updateRestaurantStatus);
router.post('/:id/photos', upload.array('photos', 10), uploadRestaurantPhotos);
router.delete('/:id', deleteRestaurant);

export default router;
