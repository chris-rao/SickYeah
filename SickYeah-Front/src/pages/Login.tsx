import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '@/components/ui';
import { FoodIcons } from '@/components/icons';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';
import { authService } from '@/services/auth.service';

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async () => {
    setError('');
    
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isRegister) {
        const response = await authService.register({
          username: username.trim(),
          password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.trim()}`
        });
        authService.saveToken(response.token);
        setUser(response.user);
        navigate('/');
      } else {
        const response = await authService.login({
          username: username.trim(),
          password
        });
        authService.saveToken(response.token);
        setUser(response.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-food-bg relative overflow-hidden">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm flex flex-col items-center z-10"
      >
        <div className="mb-12 flex flex-col items-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <FoodIcons.Burger className="w-32 h-32 mb-6" />
          </motion.div>
          <h1 className="text-5xl font-black text-food-ink tracking-tighter drop-shadow-[0_6px_0_rgba(255,215,0,0.8)]">
            食嘢真系好紧要
          </h1>
          <p className="text-food-bread font-black text-lg mt-2 tracking-widest uppercase">
            Eating is Priority
          </p>
        </div>

        <Card className="w-full relative py-10 px-8 bg-white border-b-[12px] border-food-bread/20 shadow-2xl">
          {/* Takeout bag fold effect */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-food-cheese food-border rounded-t-full -z-10" />
          
          <div className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-bold">
                {error}
              </div>
            )}
            
            <Input 
              label="用户名" 
              placeholder="输入你的吃货昵称" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              label="密码" 
              placeholder="输入秘密口令" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button 
              onClick={handleSubmit} 
              className="mt-6 w-full text-xl py-5 bg-food-cheese hover:bg-yellow-400"
            >
              {loading ? '请稍候...' : (isRegister ? 'join' : 'let go eat！')}
            </Button>
            
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm font-bold text-food-ink/60 hover:text-food-cheese transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {isRegister ? '已有账号？去登录' : '还没账号？去注册'}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
