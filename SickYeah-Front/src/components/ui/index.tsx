import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FoodIcons } from '../icons';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BackgroundPatterns = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-[0.12]">
    <div className="absolute top-[5%] left-[10%] rotate-12 scale-150"><FoodIcons.Burger className="w-12 h-12" /></div>
    <div className="absolute top-[15%] right-[15%] -rotate-12 scale-125"><FoodIcons.Fries className="w-12 h-12" /></div>
    <div className="absolute top-[40%] left-[5%] rotate-45 scale-110"><FoodIcons.Wing className="w-12 h-12" /></div>
    <div className="absolute top-[60%] right-[10%] -rotate-45 scale-150"><FoodIcons.Soda className="w-12 h-12" /></div>
    <div className="absolute bottom-[10%] left-[20%] rotate-12 scale-125"><FoodIcons.Pizza className="w-12 h-12" /></div>
    <div className="absolute bottom-[20%] right-[20%] -rotate-12 scale-110"><FoodIcons.IceCream className="w-12 h-12" /></div>
    <div className="absolute top-[30%] left-[40%] rotate-[-20deg] scale-150"><FoodIcons.Sandwich className="w-12 h-12" /></div>
    <div className="absolute bottom-[40%] left-[45%] rotate-[30deg] scale-125"><FoodIcons.Coffee className="w-12 h-12" /></div>
    <div className="absolute top-[70%] left-[30%] rotate-[-10deg] scale-110"><FoodIcons.Burger className="w-10 h-10 opacity-50" /></div>
    <div className="absolute top-[10%] left-[60%] rotate-[15deg] scale-125"><FoodIcons.Fries className="w-10 h-10 opacity-50" /></div>
  </div>
);

export const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white food-border food-shadow rounded-[32px] p-4 transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
      className
    )}
  >
    {children}
  </div>
);

export const Button = ({ children, className, onClick, variant = 'primary', disabled }: { 
  children: React.ReactNode, 
  className?: string, 
  onClick?: () => void,
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost',
  disabled?: boolean
}) => {
  const variants = {
    primary: "bg-food-cheese text-food-ink",
    secondary: "bg-food-paper text-food-ink",
    danger: "bg-food-tomato text-white",
    ghost: "bg-transparent border-none shadow-none"
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "food-border food-shadow rounded-full px-6 py-3 font-bold active-press",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export const CapsuleTabs = ({ activeKey, onChange, children }: { 
  activeKey: string, 
  onChange: (key: string) => void,
  children: React.ReactNode
}) => {
  return (
    <div className="flex w-full">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        const isActive = child.key === activeKey;
        return (
          <button
            onClick={() => onChange(child.key as string)}
            className={cn(
              "flex-1 py-2 px-4 rounded-full font-bold transition-all",
              isActive ? "bg-food-cheese text-food-ink food-shadow-sm" : "text-food-ink/40"
            )}
          >
            {child.props.title}
          </button>
        );
      })}
    </div>
  );
};

CapsuleTabs.Tab = ({ title }: { title: string, key: string }) => null;

export const Toast = {
  show: ({ content, icon }: { content: string, icon?: 'success' | 'fail' }) => {
    const toastEl = document.createElement('div');
    toastEl.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-food-ink text-white rounded-full food-shadow-sm font-bold animate-toast';
    toastEl.textContent = content;
    
    document.body.appendChild(toastEl);
    
    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%, -20px)';
      toastEl.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(toastEl);
      }, 300);
    }, 2000);
  }
};

export const Input = ({ label, placeholder, type = 'text', value, onChange }: { 
  label?: string, 
  placeholder?: string, 
  type?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="font-bold text-sm ml-2">{label}</label>}
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-white food-border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-food-cheese transition-all"
    />
  </div>
);

