import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';

interface MagicalErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: 'default' | 'gentle' | 'maintenance';
}

export function MagicalError({
  title = 'Oops! Algo correu mal',
  message = 'Não conseguimos carregar esta página. Mas não te preocupes, estamos a trabalhar nisso!',
  onRetry,
  showRetry = true,
  variant = 'default',
}: MagicalErrorProps) {
  if (variant === 'gentle') {
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-6 relative">
          {/* Sad but cute emoji with floating comfort elements */}
          <div className="text-6xl mb-4">😔</div>
          <div className="absolute -top-2 -left-8 text-2xl animate-pulse opacity-60">
            💙
          </div>
          <div className="absolute top-4 -right-6 text-xl animate-bounce opacity-60">
            ✨
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
          {message}
        </p>

        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'maintenance') {
    return (
      <div className="text-center py-16 px-4">
        <div className="mb-8 relative">
          {/* Construction/maintenance theme */}
          <div className="text-6xl mb-4">🔧</div>
          <div className="absolute -top-4 -left-8 text-2xl animate-bounce opacity-60">
            ⚙️
          </div>
          <div className="absolute top-2 -right-8 text-xl animate-pulse opacity-60">
            🛠️
          </div>
          <div className="absolute -bottom-2 left-4 text-lg animate-bounce delay-300 opacity-60">
            ✨
          </div>
        </div>

        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Estamos a Melhorar a Experiência
        </h3>
        <p className="text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
          Os nossos pequenos elfos estão a trabalhar para tornar tudo mais
          mágico. Voltaremos em breve com algo incrível!
        </p>

        <div className="flex justify-center items-center space-x-1">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="text-center py-12 px-4">
      <div className="mb-6 relative">
        {/* Error emoji with floating support elements */}
        <div className="text-6xl mb-4">😟</div>
        <div className="absolute -top-4 -left-6 text-2xl animate-pulse opacity-60">
          💫
        </div>
        <div className="absolute top-2 -right-8 text-xl animate-bounce opacity-60">
          <Heart className="h-6 w-6 text-pink-400" />
        </div>
        <div className="absolute -bottom-2 left-2 text-lg animate-bounce delay-300 opacity-60">
          🌟
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
        {message}
      </p>

      {showRetry && onRetry && (
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>

          <p className="text-sm text-gray-500">
            Se o problema persistir, contacta-nos. Estamos aqui para ajudar! 💜
          </p>
        </div>
      )}
    </div>
  );
}
