import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Toast, BackgroundPatterns } from '@/components/ui';
import { FoodIcons } from '@/components/icons';
import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { restaurantAPI } from '@/api';

export const Report = () => {
  const navigate = useNavigate();
  const { addRestaurant } = useStore();
  const [form, setForm] = useState({
    name: '',
    address: '',
    recommendedDishes: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.address) {
      Toast.show({ content: '名字和地址是必填的哦！' });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await restaurantAPI.create({
        ...form,
        status: 'to-eat',
      });
      
      // 同步到本地 store
      if (response.success) {
        addRestaurant({
          ...form,
          status: 'to-eat',
          id: response.data.id,
        });
      }
      
      Toast.show({ content: '上报成功！出餐啦！', icon: 'success' });
      navigate('/');
    } catch (error: any) {
      console.error('上报失败:', error);
      Toast.show({ content: error.message || '上报失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-food-bg flex flex-col relative overflow-hidden">
      <BackgroundPatterns variant="report" />
      
      <header className="p-4 flex items-center gap-4 bg-food-tomato sticky top-0 z-20 food-border border-x-0 border-t-0 shadow-lg">
        <Button variant="secondary" onClick={() => navigate('/')} className="p-2 food-shadow-sm bg-white">
          <FoodIcons.Back className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-black text-white drop-shadow-sm">上报</h1>
      </header>

      <main className="p-6 flex flex-col gap-6 z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="bg-white flex flex-col gap-8 p-8 shadow-2xl border-b-[12px] border-food-bread/10">
            <div className="flex items-center gap-3 mb-2 bg-food-cheese/10 p-4 rounded-2xl food-border border-dashed">
              <FoodIcons.Chef className="w-8 h-8 text-food-tomato animate-pulse" />
              <h2 className="font-black text-2xl text-food-ink">写低间嘢系边</h2>
            </div>

            <Input 
              label="餐厅名称" 
              // placeholder="这家店叫什么？" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            
            <Input 
              label="餐厅地址" 
              // placeholder="在哪里可以吃到？" 
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <Input 
              label="推荐菜" 
              // placeholder="必点的是哪道菜？" 
              value={form.recommendedDishes}
              onChange={(e) => setForm({ ...form, recommendedDishes: e.target.value })}
            />

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm ml-2">评价</label>
              <textarea
                placeholder="选填"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-white food-border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-food-cheese transition-all"
              />
            </div>

            {/* <div className="flex flex-col gap-2">
              <label className="font-bold text-sm ml-2">美食快照</label>
              <div className="w-full aspect-video bg-white food-border border-dashed rounded-2xl flex flex-col items-center justify-center text-food-ink/30 hover:bg-food-cheese/5 transition-colors cursor-pointer">
                <FoodIcons.Camera className="w-10 h-10 mb-2" />
                <span className="font-bold text-sm">点击上传图片</span>
              </div>
            </div> */}

            <Button 
              onClick={handleSubmit} 
              className="mt-4 py-4 text-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '确认'}
            </Button>
          </Card>
        </motion.div>
      </main>

      <div className="fixed -bottom-10 -right-10 opacity-10 rotate-[-20deg] scale-150">
        <FoodIcons.Burger className="w-32 h-32" />
      </div>
    </div>
  );
};
