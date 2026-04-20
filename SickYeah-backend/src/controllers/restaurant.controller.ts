import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';

export const getRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const { status, rating } = req.query;
    
    const where: any = {
      userId: req.userId
    };

    if (status) {
      where.status = status as string;
    }

    if (rating) {
      where.rating = rating as string;
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        reviews: {
          include: {
            photos: true
          }
        }
      }
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json({ data: restaurants });
  } catch (error) {
    console.error('获取餐厅列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const getRestaurantById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        reviews: {
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
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: '餐厅未找到' });
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json({ data: restaurant });
  } catch (error) {
    console.error('获取餐厅详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, recommendedDishes, description, image, status } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: '餐厅名称和地址是必填项' });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        recommendedDishes: recommendedDishes || '',
        description: description || '',
        image,
        status: status || 'to-eat',
        userId: req.userId!
      }
    });

    res.status(201).json({ restaurant });
  } catch (error) {
    console.error('创建餐厅错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, recommendedDishes, description, image } = req.body;

    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingRestaurant) {
      return res.status(404).json({ error: '餐厅未找到' });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(recommendedDishes !== undefined && { recommendedDishes }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image })
      }
    });

    res.json({ restaurant });
  } catch (error) {
    console.error('更新餐厅错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const updateRestaurantStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rating } = req.body;

    if (!status) {
      return res.status(400).json({ error: '状态是必填项' });
    }

    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingRestaurant) {
      return res.status(404).json({ error: '餐厅未找到' });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        status,
        ...(rating !== undefined && { rating })
      }
    });

    res.json({ restaurant });
  } catch (error) {
    console.error('更新餐厅状态错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingRestaurant) {
      return res.status(404).json({ error: '餐厅未找到' });
    }

    await prisma.restaurant.delete({
      where: { id }
    });

    res.json({ message: '餐厅已删除' });
  } catch (error) {
    console.error('删除餐厅错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};
