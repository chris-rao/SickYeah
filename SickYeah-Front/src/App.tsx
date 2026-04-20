import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { RestaurantList } from './pages/RestaurantList';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Report } from './pages/Report';
import { useStore } from './store/useStore';
import { authService } from './services/auth.service';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const LoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const { setUser } = useStore();
  
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          authService.logout();
        }
      }
      
      setInitializing(false);
    };
    
    initAuth();
  }, [setUser]);
  
  if (initializing) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-food-cheese mx-auto mb-4"></div>
          <p className="text-food-ink font-bold">加载中...</p>
        </div>
      </div>
    );
  }
  
  
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        <Routes>
          <Route 
            path="/login" 
            element={
              <LoginRoute>
                <Login />
              </LoginRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurants/to-eat" 
            element={
              <ProtectedRoute>
                <RestaurantList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurants/eaten" 
            element={
              <ProtectedRoute>
                <RestaurantList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurant/:id" 
            element={
              <ProtectedRoute>
                <RestaurantDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
