import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, BackgroundPatterns, Dialog } from '@/components/ui';
import { FoodIcons } from '@/components/icons';
import { useStore } from '@/store/useStore';
import { authService } from '@/services/auth.service';
import { motion } from 'motion/react';

export const Home = () => {
  const { user, clearUser } = useStore();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div className="min-h-screen p-6 bg-food-bg flex flex-col relative overflow-hidden">
      <BackgroundPatterns variant="home" />
      
      <header className="flex justify-between items-center z-10 bg-white/40 p-4 rounded-3xl food-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full food-border overflow-hidden bg-white shadow-lg">
            <img src={user?.avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xl text-food-ink">{user?.username}</span>
        </div>
        <Button 
          variant="secondary" 
          className="p-3 bg-white"
          onClick={() => setShowLogoutDialog(true)}
        >
          <FoodIcons.User className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center gap-12 mb-24">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <h2 className="text-5xl font-black text-food-ink leading-tight drop-shadow-[0_4px_0_rgba(255,184,0,0.5)]">
            今日食d乜
          </h2>
          {/* <div className="absolute -top-8 -right-8 rotate-12">
            <FoodIcons.Fries />
          </div> */}
        </motion.div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-md z-10">
          <Card 
            onClick={() => navigate('/restaurants/to-eat')}
            className="col-span-1 aspect-square flex flex-col items-center justify-center gap-3 bg-food-cheese/20 hover:bg-food-cheese/30 border-food-cheese"
          >
            <FoodIcons.Fries className="scale-125" />
            <span className="font-black text-xl">未check</span>
          </Card>
          
          <Card 
            onClick={() => navigate('/restaurants/eaten')}
            className="col-span-1 aspect-square flex flex-col items-center justify-center gap-3 bg-food-lettuce/20 hover:bg-food-lettuce/30 border-food-lettuce"
          >
            <div className="relative scale-125">
              <FoodIcons.Wing className="w-10 h-10" />
              <div className="absolute -top-2 -right-2 bg-food-tomato text-white text-[10px] px-1.5 py-0.5 rounded-full food-border rotate-12">Yum!</div>
            </div>
            <span className="font-black text-xl">check过</span>
          </Card>

          <Card 
            onClick={() => navigate('/report')}
            className="col-span-2 py-8 flex items-center justify-center gap-6 bg-food-tomato/20 hover:bg-food-tomato/30 border-food-tomato"
          >
            <FoodIcons.Chef className="w-10 h-10 text-food-tomato animate-bounce" />
            <span className="font-black text-2xl">上报</span>
          </Card>
        </div>
      </main>

      <footer className="mt-auto pt-8 text-center text-food-ink/40 font-bold text-sm">
        v1.0
      </footer>

      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="退出登录"
        content="确定要退出登录吗？"
        confirmText="确认"
        cancelText="取消"
        onConfirm={() => {
          authService.logout();
          clearUser();
          navigate('/login');
        }}
      />
    </div>
  );
};
