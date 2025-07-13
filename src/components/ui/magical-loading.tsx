import { Sparkles, Star, Heart } from 'lucide-react';

interface MagicalLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'card' | 'inline';
}

export function MagicalLoading({ 
  size = 'md', 
  text = 'A carregar magia...', 
  variant = 'default' 
}: MagicalLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'card') {
    return (
      <div className="h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Floating magical elements */}
        <div className="absolute top-6 left-6 text-2xl animate-bounce opacity-60">✨</div>
        <div className="absolute top-8 right-8 text-xl animate-pulse opacity-60">🌟</div>
        <div className="absolute bottom-6 left-8 text-lg animate-bounce delay-300 opacity-60">💫</div>
        <div className="absolute bottom-8 right-6 text-xl animate-pulse delay-500 opacity-60">🎪</div>
        
        {/* Main spinner */}
        <div className="relative">
          <div className="h-16 w-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <div className="absolute inset-0 h-16 w-16 border-4 border-transparent border-r-pink-400 rounded-full animate-spin animate-reverse"></div>
        </div>
        
        <p className="text-purple-600 font-medium">{text}</p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Sparkles className={`${sizeClasses[size]} text-purple-500 animate-pulse`} />
          <div className="absolute -top-1 -right-1">
            <Star className="h-3 w-3 text-pink-400 animate-bounce" />
          </div>
        </div>
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </span>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Magical floating elements */}
      <div className="relative mb-6">
        <div className="absolute -top-4 -left-4 text-2xl animate-bounce opacity-70">🎨</div>
        <div className="absolute -top-2 -right-6 text-xl animate-pulse opacity-70">✨</div>
        <div className="absolute -bottom-4 left-2 text-lg animate-bounce delay-300 opacity-70">🌈</div>
        
        {/* Main loading spinner */}
        <div className="relative">
          <div className="h-16 w-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 h-16 w-16 border-4 border-transparent border-r-pink-400 rounded-full animate-spin animate-reverse"></div>
          <div className="absolute inset-2 h-12 w-12 border-2 border-transparent border-b-blue-400 rounded-full animate-spin"></div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Preparando a Magia
        </h3>
        <p className="text-gray-600 font-medium">{text}</p>
        
        {/* Magical dots animation */}
        <div className="flex justify-center items-center space-x-1 mt-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}