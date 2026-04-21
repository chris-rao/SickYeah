import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    if (!restaurantId || !rating) {
      return res.status(400).json({ error: '餐厅ID和评分是必填项' });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        userId: req.userId
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: '餐厅未找到' });
    }

    const review = await prisma.review.create({
      data: {
        restaurantId,
        userId: req.userId!,
        rating,
        comment: comment || ''
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({ data: review });
  } catch (error) {
    console.error('创建评价错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const uploadReviewPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const { id: reviewId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: '请上传至少一张照片' });
    }

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: req.userId
      }
    });

    if (!review) {
      return res.status(404).json({ error: '评价未找到' });
    }

    const photoPromises = files.map(file => 
      prisma.reviewPhoto.create({
        data: {
          reviewId,
          photoUrl: `/uploads/${file.filename}`
        }
      })
    );

    const photos = await Promise.all(photoPromises);

    // 若餐厅尚无封面图，将第一张上传的照片设为餐厅封面
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: review.restaurantId }
    });
    if (restaurant && !restaurant.image && photos.length > 0) {
      await prisma.restaurant.update({
        where: { id: review.restaurantId },
        data: { image: photos[0].photoUrl }
      });
    }

    res.status(201).json({ photos });
  } catch (error) {
    console.error('上传评价照片错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const getRestaurantReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        restaurantId
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('获取餐厅评价错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};
