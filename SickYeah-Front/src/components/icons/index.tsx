import React from 'react';
import { 
  Utensils, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  Circle, 
  ChefHat, 
  Camera,
  ArrowLeft,
  User as UserIcon,
  Smile,
  Frown,
  Pizza,
  Coffee,
  IceCream,
  Drumstick,
  Sandwich
} from 'lucide-react';

export const FoodIcons = {
  Fries: ({ className }: { className?: string }) => (
    <div className={`relative w-10 h-10 flex items-end justify-center ${className}`}>
      <div className="w-8 h-6 bg-food-tomato rounded-t-md food-border shadow-inner" />
      <div className="absolute -top-2 flex gap-0.5">
        <div className="w-1.5 h-7 bg-food-cheese food-border rounded-sm rotate-[-8deg] shadow-sm" />
        <div className="w-1.5 h-8 bg-food-cheese food-border rounded-sm rotate-[3deg] shadow-sm" />
        <div className="w-1.5 h-7 bg-food-cheese food-border rounded-sm rotate-[-3deg] shadow-sm" />
        <div className="w-1.5 h-8 bg-food-cheese food-border rounded-sm rotate-[6deg] shadow-sm" />
      </div>
    </div>
  ),
  Wing: ({ className }: { className?: string }) => (
    <div className={`relative ${className} flex items-center justify-center`}>
      <Drumstick className="w-full h-full text-orange-600 drop-shadow-md" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
    </div>
  ),
  Burger: ({ className }: { className?: string }) => (
    <div className={`relative ${className} flex flex-col items-center drop-shadow-lg`}>
      <div className="w-full h-1/3 bg-orange-400 rounded-t-full food-border" />
      <div className="w-[110%] h-1/6 bg-food-lettuce rounded-sm food-border -my-0.5 z-10" />
      <div className="w-[105%] h-1/6 bg-food-cheese rounded-sm food-border -my-0.5 z-20" />
      <div className="w-full h-1/4 bg-food-bread rounded-sm food-border z-0" />
      <div className="w-full h-1/3 bg-orange-400 rounded-b-xl food-border" />
    </div>
  ),
  Soda: ({ className }: { className?: string }) => (
    <div className={`relative ${className} flex flex-col items-center`}>
      <div className="w-1 h-4 bg-food-tomato food-border rounded-full -mb-1 z-10 rotate-12" />
      <div className="w-full h-1/6 bg-gray-200 rounded-t-md food-border" />
      <div className="w-full h-4/5 bg-food-soda rounded-b-lg food-border flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-white/20 -rotate-45 translate-x-4" />
      </div>
    </div>
  ),
  Pizza: ({ className }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <Pizza className="w-full h-full text-yellow-500 drop-shadow-md" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
        <div className="w-1.5 h-1.5 bg-food-tomato rounded-full" />
        <div className="w-1.5 h-1.5 bg-food-tomato rounded-full translate-y-2" />
      </div>
    </div>
  ),
  Chef: ChefHat,
  Camera: Camera,
  Map: MapPin,
  Add: PlusCircle,
  Done: CheckCircle2,
  Pending: Circle,
  Back: ArrowLeft,
  User: UserIcon,
  Good: Smile,
  Bad: Frown,
  Sandwich: Sandwich,
  IceCream: IceCream,
  Coffee: Coffee
};
