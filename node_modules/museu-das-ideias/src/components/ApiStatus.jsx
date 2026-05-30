/**
 * Componente que verifica e exibe o status da conexão com a API
 */

import { useState, useEffect } from 'react';
import { checkApiHealth } from '../services/ideaService';

export default function ApiStatus() {
  const [isOnline, setIsOnline] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setChecking(true);
      const status = await checkApiHealth();
      setIsOnline(status);
      setChecking(false);
    };

    checkStatus();
    
    // Verifica a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (checking) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#6a5c8a]">
        <span className="animate-pulse">⏳</span>
        Verificando API...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {isOnline ? (
        <>
          <span className="w-2 h-2 bg-[#6dd47e] rounded-full animate-pulse"></span>
          <span className="text-[#6dd47e]">API Online</span>
        </>
      ) : (
        <>
          <span className="w-2 h-2 bg-[#e06060] rounded-full"></span>
          <span className="text-[#e06060]">API Offline</span>
        </>
      )}
    </div>
  );
}
