import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Toast, cn, BackgroundPatterns } from '@/components/ui';
import { FoodIcons } from '@/components/icons';
import { restaurantAPI, reviewAPI } from '@/api';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

const getImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

type ReviewStep = 'rating' | 'comment' | 'photo' | null;

interface Restaurant {
  id: string;
  name: string;
  address: string;
  recommendedDishes?: string;
  description?: string;
  image?: string;
  status: 'to-eat' | 'eaten';
  rating?: 'good' | 'bad';
}

export const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviewStep, setReviewStep] = useState<ReviewStep>(null);
  const [selectedRating, setSelectedRating] = useState<'good' | 'bad' | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  // 获取餐厅详情
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) {
        setError('餐厅ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await restaurantAPI.getById(id);
        setRestaurant(response.data);
        setError(null);
      } catch (err: any) {
        console.error('获取餐厅详情失败:', err);
        setError(err.response?.data?.error || '获取餐厅详情失败');
        Toast.show({ content: '获取餐厅详情失败，请重试' });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-food-bg flex flex-col items-center justify-center relative overflow-hidden">
        <BackgroundPatterns variant="detail" />
        <FoodIcons.Burger className="w-16 h-16 text-food-ink/40 mb-4 animate-pulse" />
        <p className="text-food-ink/60 font-bold">加载中...</p>
      </div>
    );
  }

  // 错误或未找到状态
  if (!restaurant || error) {
    return (
      <div className="min-h-screen bg-food-bg flex flex-col items-center justify-center relative overflow-hidden">
        <BackgroundPatterns variant="detail" />
        <FoodIcons.Bad className="w-16 h-16 text-food-ink/40 mb-4" />
        <p className="text-food-ink/60 font-bold mb-4">找不到这家店啦！</p>
        <Button onClick={() => navigate(-1)}>返回上一页</Button>
      </div>
    );
  }

  const imageUrl = getImageUrl(restaurant.image);

  const handleEatenClick = () => {
    setReviewStep('rating');
  };

  const handleRateSelect = (rating: 'good' | 'bad') => {
    setSelectedRating(rating);
    setReviewStep('comment');
  };

  const handleCommentNext = () => {
    setReviewStep('photo');
  };

  const handleCommentSkip = () => {
    setReviewStep('photo');
  };

  const handlePhotoSubmit = () => {
    submitReview();
  };

  const handlePhotoSkip = () => {
    submitReview();
  };

  const submitReview = async () => {
    if (!selectedRating) {
      Toast.show({ content: '请选择评价' });
      return;
    }

    try {
      // 1. 创建评价
      const reviewResponse = await reviewAPI.create({
        restaurantId: restaurant!.id,
        rating: selectedRating,
        comment: reviewComment,
      });

      const reviewId = reviewResponse.data.id;

      // 2. 上传照片（如果有）
      if (uploadedPhotos.length > 0) {
        try {
          await reviewAPI.uploadPhotos(reviewId, uploadedPhotos);
        } catch (photoError) {
          console.error('上传照片失败:', photoError);
          // 照片上传失败不影响评价提交
        }
      }

      // 3. 更新餐厅状态
      await restaurantAPI.updateStatus(restaurant!.id, {
        status: 'eaten',
        rating: selectedRating,
      });

      Toast.show({ content: '打卡成功！', icon: 'success' });
      navigate('/restaurants/eaten');
    } catch (error: any) {
      console.error('提交评价失败:', error);
      Toast.show({ 
        content: error.response?.data?.error || '打卡失败，请重试' 
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedPhotos(prev => [...prev, ...filesArray]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-food-bg flex flex-col relative overflow-hidden">
      <BackgroundPatterns variant="detail" />

      {/* Header */}
      <header className="p-4 flex items-center gap-4 bg-food-cheese sticky top-0 z-20 food-border border-x-0 border-t-0 shadow-lg">
        <Button variant="secondary" onClick={() => navigate(-1)} className="p-2 food-shadow-sm bg-white">
          <FoodIcons.Back className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-black text-food-ink drop-shadow-sm truncate">
          {restaurant.name}
        </h1>
      </header>

      <main className="flex-1 flex flex-col z-10 pb-32">
        {/* Carousel - 仅已食状态显示 */}
        {restaurant.status === 'eaten' && (
          <div className="relative w-full aspect-square max-h-[38vh] bg-food-paper food-border border-x-0 border-t-0 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={cn(
              "fallback-icon absolute inset-0 items-center justify-center bg-food-cheese/10",
              imageUrl ? "hidden" : "flex"
            )}>
              <FoodIcons.Burger className="w-24 h-24 opacity-30" />
            </div>
          </div>
        )}

        {/* Info Content */}
        <div className={cn(
          "p-6 z-10 relative",
          restaurant.status === 'eaten' ? "-mt-8" : ""
        )}>
          <Card className="bg-white p-6 flex flex-col gap-6 shadow-xl border-b-[8px] border-food-ink/5">
            {/* Title & Address */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black text-food-ink">{restaurant.name}</h2>
              <div className="flex items-start gap-2 text-food-ink/60 font-bold mt-1">
                <FoodIcons.Map className="w-5 h-5 shrink-0 text-food-tomato" />
                <span className="leading-snug">{restaurant.address}</span>
              </div>
            </div>

            {/* Recommended Dishes */}
            {restaurant.recommendedDishes && (
              <div className="bg-food-cheese/10 p-4 rounded-2xl food-border border-dashed">
                <div className="flex items-center gap-2 mb-2 text-food-tomato font-black">
                  <FoodIcons.Chef className="w-5 h-5" />
                  <h3>必点推荐</h3>
                </div>
                <p className="text-food-ink font-bold">{restaurant.recommendedDishes}</p>
              </div>
            )}

            {/* Description */}
            {restaurant.description && (
              <div className="bg-food-paper/30 p-4 rounded-2xl food-border border-none">
                <div className="flex items-center gap-2 mb-2 text-food-ink/80 font-black">
                  <FoodIcons.Good className="w-5 h-5" />
                  <h3>评价</h3>
                </div>
                <p className="text-food-ink/80 italic leading-relaxed">
                  “{restaurant.description}”
                </p>
              </div>
            )}
            
            {/* Status Badge if eaten */}
            {restaurant.status === 'eaten' && (
              <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-food-lettuce/10 text-food-lettuce rounded-full food-border font-black">
                <FoodIcons.Done className="w-5 h-5" />
                <span>已经check过啦！</span>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Action Footer (Fixed) */}
      {restaurant.status === 'to-eat' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-30 max-w-md mx-auto pointer-events-none">
          <Button 
            onClick={handleEatenClick} 
            className="w-full py-4 text-xl shadow-2xl pointer-events-auto"
          >
            食饱啦，去评价！
          </Button>
        </div>
      )}

      {/* Rating Modal - 步骤1：选择评价 */}
      <AnimatePresence>
        {reviewStep === 'rating' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-food-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 max-w-md mx-auto"
            onClick={() => setReviewStep(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full"
            >
              <Card className="bg-white p-8 flex flex-col items-center gap-6 shadow-2xl">
                <h3 className="text-2xl font-black text-food-ink">评价</h3>
                <div className="flex w-full gap-4">
                  <button 
                    onClick={() => handleRateSelect('good')}
                    className="flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl food-border bg-food-lettuce/10 hover:bg-food-lettuce/20 transition-colors group active-press"
                  >
                    <div className="w-16 h-16 rounded-full bg-food-lettuce text-white flex items-center justify-center food-shadow-sm group-hover:scale-110 transition-transform">
                      <FoodIcons.Good className="w-10 h-10" />
                    </div>
                    <span className="font-black text-food-lettuce">两条裤</span>
                  </button>
                  
                  <button 
                    onClick={() => handleRateSelect('bad')}
                    className="flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl food-border bg-gray-100 hover:bg-gray-200 transition-colors group active-press"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-400 text-white flex items-center justify-center food-shadow-sm group-hover:scale-110 transition-transform">
                      <FoodIcons.Bad className="w-10 h-10" />
                    </div>
                    <span className="font-black text-gray-500">把撚</span>
                  </button>
                </div>
                <Button variant="ghost" onClick={() => setReviewStep(null)} className="mt-2 text-food-ink/50">
                  再谂下
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal - 步骤2：文本评价 */}
      <AnimatePresence>
        {reviewStep === 'comment' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-food-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 max-w-md mx-auto"
            onClick={() => setReviewStep(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full"
            >
              <Card className="bg-white p-8 flex flex-col gap-6 shadow-2xl">
                <h3 className="text-2xl font-black text-food-ink">写作文</h3>
                <textarea
                  placeholder="分享你的用餐体验..."
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="bg-white food-border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-food-cheese transition-all resize-none"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCommentNext} 
                    className="flex-1 py-3"
                  >
                    下一步
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCommentSkip} 
                    className="flex-1 py-3"
                  >
                    跳过
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Modal - 步骤3：上传照片 */}
      <AnimatePresence>
        {reviewStep === 'photo' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-food-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 max-w-md mx-auto overflow-y-auto"
            onClick={() => setReviewStep(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full my-auto"
            >
              <Card className="bg-white p-8 flex flex-col gap-6 shadow-2xl">
                <h3 className="text-2xl font-black text-food-ink">晒晒美食照片</h3>
                
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="w-full aspect-video bg-white food-border border-dashed rounded-2xl flex flex-col items-center justify-center text-food-ink/30 hover:bg-food-cheese/5 transition-colors cursor-pointer"
                  >
                    <FoodIcons.Camera className="w-10 h-10 mb-2" />
                    <span className="font-bold text-sm">点击上传照片</span>
                  </label>

                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedPhotos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden food-border">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`上传照片 ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-food-tomato text-white rounded-full flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handlePhotoSubmit} 
                    className="flex-1 py-3"
                  >
                    完成打卡
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handlePhotoSkip} 
                    className="flex-1 py-3"
                  >
                    跳过
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
