import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, cn, CapsuleTabs, BackgroundPatterns, Toast } from '@/components/ui';
import { FoodIcons } from '@/components/icons';
import { restaurantAPI } from '@/api';
import { motion, AnimatePresence } from 'motion/react';

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

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

const getImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

export const RestaurantList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname === '/restaurants/to-eat' ? 'to-eat' : 'eaten';
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad'>('all');
  const [activeTab, setActiveTab] = useState<'to-eat' | 'eaten'>(type);
  
  // 获取餐厅列表
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const params: { status?: string; rating?: string } = {
          status: activeTab,
        };
        
        // 如果是已食状态且有评分筛选，添加 rating 参数
        if (activeTab === 'eaten' && filter !== 'all') {
          params.rating = filter;
        }
        
        const response = await restaurantAPI.getList(params);
        console.log(response);
        setRestaurants(response.data);
      } catch (error: any) {
        console.error('获取餐厅列表失败:', error);
        Toast.show({ 
          content: error.response?.data?.error || '获取餐厅列表失败，请重试' 
        });
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [activeTab, filter]);
  
  const handleTabChange = (key: string) => {
    setActiveTab(key as 'to-eat' | 'eaten');
    setFilter('all'); // 切换标签时重置筛选
    navigate(key === 'to-eat' ? '/restaurants/to-eat' : '/restaurants/eaten');
  };

  return (
    <div className="min-h-screen bg-food-bg flex flex-col relative overflow-hidden">
      <BackgroundPatterns variant="list" />
      
      <header className="p-4 flex items-center gap-4 bg-food-cheese sticky top-0 z-20 food-border border-x-0 border-t-0 shadow-lg">
        <Button variant="secondary" onClick={() => navigate('/')} className="p-2 food-shadow-sm bg-white">
          <FoodIcons.Back className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-black text-food-ink drop-shadow-sm">
          Check List
        </h1>
      </header>

      <div className="p-6 z-10">
        <div className="bg-white p-1.5 rounded-full mb-8 shadow-inner">
          <CapsuleTabs activeKey={activeTab} onChange={handleTabChange}>
            <CapsuleTabs.Tab title="未check 🍟" key="to-eat" />
            <CapsuleTabs.Tab title="check过 🍗" key="eaten" />
          </CapsuleTabs>
        </div>

        {activeTab === 'eaten' && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button 
              variant={filter === 'all' ? 'primary' : 'secondary'} 
              className="py-1 px-4 text-sm whitespace-nowrap"
              onClick={() => setFilter('all')}
            >
              全部
            </Button>
            <Button 
              variant={filter === 'good' ? 'primary' : 'secondary'} 
              className="py-1 px-4 text-sm whitespace-nowrap flex items-center gap-1"
              onClick={() => setFilter('good')}
            >
              <FoodIcons.Good className="w-4 h-4" /> 两条裤
            </Button>
            <Button 
              variant={filter === 'bad' ? 'primary' : 'secondary'} 
              className="py-1 px-4 text-sm whitespace-nowrap flex items-center gap-1"
              onClick={() => setFilter('bad')}
            >
              <FoodIcons.Bad className="w-4 h-4" /> 把撚
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FoodIcons.Burger className="w-16 h-16 text-food-ink/40 mb-4 animate-pulse" />
              <p className="font-bold text-food-ink/60">加载中...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {restaurants?.length > 0 ? (
                restaurants.map((r, idx) => (
                <motion.div
                  key={r.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card 
                    className="flex gap-4 items-center relative overflow-hidden bg-white hover:bg-food-cheese/5 border-food-ink/10 cursor-pointer" 
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                  >
                    <div className="w-24 h-24 rounded-3xl food-border bg-food-paper flex items-center justify-center shrink-0 shadow-inner">
                      {r.image ? (
                        <img src={getImageUrl(r.image) ?? undefined} alt={r.name} className="w-full h-full object-cover rounded-3xl" />
                      ) : (
                        <div className="bg-food-cheese/20 w-full h-full flex items-center justify-center rounded-3xl">
                          <FoodIcons.Burger className="w-12 h-12 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-xl truncate text-food-ink">{r.name}</h3>
                      <div className="flex items-center gap-1 text-food-bread text-xs mt-1 font-bold">
                        <FoodIcons.Map className="w-3.5 h-3.5" />
                        <span className="truncate">{r.address}</span>
                      </div>
                      <p className="text-sm mt-3 line-clamp-2 text-food-ink/80 italic bg-food-paper/50 p-2 rounded-xl border-l-4 border-food-cheese">
                        “{r.description}”
                      </p>
                    </div>
                    
                    {activeTab === 'eaten' && r.rating && (
                      <div className={cn(
                        "absolute -right-2 -bottom-2 w-12 h-12 flex items-center justify-center rotate-[-15deg] food-border rounded-full",
                        r.rating === 'good' ? 'bg-food-lettuce text-white' : 'bg-gray-400 text-white'
                      )}>
                        {r.rating === 'good' ? <FoodIcons.Good /> : <FoodIcons.Bad />}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-food-ink/40">
                <FoodIcons.Chef className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-bold">这里空空如也，快去上报吧！</p>
              </div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed bottom-4 left-4 -z-10 opacity-10">
        <FoodIcons.Fries />
      </div>
    </div>
  );
};
