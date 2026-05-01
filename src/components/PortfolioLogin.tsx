import { useState } from 'react';
import { Lock } from 'lucide-react';

interface PortfolioLoginProps {
  onLogin: () => void;
}

export function PortfolioLogin({ onLogin }: PortfolioLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - change this to your desired password
    const correctPassword = 'portfolio2026';

    if (password === correctPassword) {
      localStorage.setItem('portfolioAuth', 'true');
      setError('');
      onLogin();
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-apple-gray-100 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-lg bg-blue-50 mb-3">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Acceso Administrador</h2>
          <p className="text-sm text-apple-gray-500 mt-1">Ingresa la contraseña para editar el portafolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              className="w-full px-4 py-2 border border-apple-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-foreground text-white rounded-lg font-medium hover:bg-foreground/90 transition-colors"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
