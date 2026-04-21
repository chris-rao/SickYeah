import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FoodIcons } from '../icons';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BackgroundVariant = 'home' | 'list' | 'detail' | 'report';

const BACKGROUND_LAYOUTS: Record<BackgroundVariant, React.ReactNode> = {
  home: (
    <>
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
    </>
  ),
  list: (
    <>
      <div className="absolute top-[8%] right-[10%] rotate-[25deg] scale-150"><FoodIcons.Pizza className="w-12 h-12" /></div>
      <div className="absolute top-[20%] left-[8%] -rotate-[15deg] scale-125"><FoodIcons.Coffee className="w-12 h-12" /></div>
      <div className="absolute top-[45%] right-[5%] rotate-[40deg] scale-110"><FoodIcons.Burger className="w-12 h-12" /></div>
      <div className="absolute top-[55%] left-[12%] -rotate-[30deg] scale-150"><FoodIcons.IceCream className="w-12 h-12" /></div>
      <div className="absolute bottom-[15%] right-[18%] rotate-[10deg] scale-125"><FoodIcons.Wing className="w-12 h-12" /></div>
      <div className="absolute bottom-[25%] left-[5%] -rotate-[20deg] scale-110"><FoodIcons.Sandwich className="w-12 h-12" /></div>
      <div className="absolute top-[35%] left-[42%] rotate-[35deg] scale-150"><FoodIcons.Soda className="w-12 h-12" /></div>
      <div className="absolute bottom-[45%] right-[40%] -rotate-[25deg] scale-125"><FoodIcons.Fries className="w-12 h-12" /></div>
      <div className="absolute top-[12%] left-[55%] rotate-[-35deg] scale-110"><FoodIcons.Pizza className="w-10 h-10 opacity-50" /></div>
      <div className="absolute bottom-[8%] left-[35%] rotate-[20deg] scale-125"><FoodIcons.Coffee className="w-10 h-10 opacity-50" /></div>
    </>
  ),
  detail: (
    <>
      <div className="absolute top-[6%] left-[15%] rotate-[-25deg] scale-150"><FoodIcons.Sandwich className="w-12 h-12" /></div>
      <div className="absolute top-[18%] right-[8%] rotate-[20deg] scale-125"><FoodIcons.Soda className="w-12 h-12" /></div>
      <div className="absolute top-[42%] left-[8%] -rotate-[40deg] scale-110"><FoodIcons.Pizza className="w-12 h-12" /></div>
      <div className="absolute top-[62%] right-[12%] rotate-[15deg] scale-150"><FoodIcons.Coffee className="w-12 h-12" /></div>
      <div className="absolute bottom-[12%] left-[18%] -rotate-[10deg] scale-125"><FoodIcons.Fries className="w-12 h-12" /></div>
      <div className="absolute bottom-[22%] right-[15%] rotate-[35deg] scale-110"><FoodIcons.Burger className="w-12 h-12" /></div>
      <div className="absolute top-[28%] left-[38%] -rotate-[30deg] scale-150"><FoodIcons.IceCream className="w-12 h-12" /></div>
      <div className="absolute bottom-[38%] right-[38%] rotate-[25deg] scale-125"><FoodIcons.Wing className="w-12 h-12" /></div>
      <div className="absolute top-[75%] left-[55%] rotate-[-15deg] scale-110"><FoodIcons.Sandwich className="w-10 h-10 opacity-50" /></div>
      <div className="absolute top-[8%] right-[40%] rotate-[10deg] scale-125"><FoodIcons.Soda className="w-10 h-10 opacity-50" /></div>
    </>
  ),
  report: (
    <>
      <div className="absolute top-[4%] right-[12%] rotate-[-18deg] scale-150"><FoodIcons.IceCream className="w-12 h-12" /></div>
      <div className="absolute top-[22%] left-[6%] rotate-[30deg] scale-125"><FoodIcons.Wing className="w-12 h-12" /></div>
      <div className="absolute top-[48%] right-[8%] rotate-[-35deg] scale-110"><FoodIcons.Coffee className="w-12 h-12" /></div>
      <div className="absolute top-[58%] left-[10%] rotate-[22deg] scale-150"><FoodIcons.Fries className="w-12 h-12" /></div>
      <div className="absolute bottom-[8%] right-[22%] rotate-[-12deg] scale-125"><FoodIcons.Burger className="w-12 h-12" /></div>
      <div className="absolute bottom-[18%] left-[15%] rotate-[42deg] scale-110"><FoodIcons.Soda className="w-12 h-12" /></div>
      <div className="absolute top-[32%] right-[42%] rotate-[-28deg] scale-150"><FoodIcons.Pizza className="w-12 h-12" /></div>
      <div className="absolute bottom-[42%] left-[42%] rotate-[18deg] scale-125"><FoodIcons.Sandwich className="w-12 h-12" /></div>
      <div className="absolute top-[65%] right-[30%] rotate-[38deg] scale-110"><FoodIcons.IceCream className="w-10 h-10 opacity-50" /></div>
      <div className="absolute top-[14%] left-[50%] rotate-[-22deg] scale-125"><FoodIcons.Wing className="w-10 h-10 opacity-50" /></div>
    </>
  ),
};

export const BackgroundPatterns = ({ variant = 'home' }: { variant?: BackgroundVariant }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
    {BACKGROUND_LAYOUTS[variant]}
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

export const Dialog = ({ 
  open, 
  onClose, 
  title, 
  content, 
  onConfirm, 
  onCancel,
  confirmText = '确认',
  cancelText = '取消'
}: { 
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white food-border rounded-[32px] p-6 max-w-sm w-full food-shadow-lg animate-scale-in">
        {title && (
          <h3 className="text-xl font-black text-food-ink mb-4 text-center">
            {title}
          </h3>
        )}
        {content && (
          <p className="text-food-ink/70 mb-6 text-center font-bold">
            {content}
          </p>
        )}
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={() => {
              onCancel?.();
              onClose();
            }}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

