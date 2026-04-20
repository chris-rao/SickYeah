import { Router } from 'express';
import {
  createReview,
  uploadReviewPhotos,
  getRestaurantReviews
} from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createReview);
router.post('/:id/photos', upload.array('photos', 10), uploadReviewPhotos);
router.get('/restaurant/:restaurantId', getRestaurantReviews);

export default router;
