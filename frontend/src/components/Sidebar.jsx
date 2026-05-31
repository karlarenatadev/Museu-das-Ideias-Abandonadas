/**
 * Sidebar - Navegação lateral do Museu
 * Gerencia os botões que abrem modais
 */

import ApiStatus from './ApiStatus';
import { useState } from 'react';

export default function Sidebar({ onNavigate }) {
  const [activeLabel, setActiveLabel] = useState('Início');

  const menuItems = [
    { id: 'inicio', icon: '🏛️', label: 'Início' },
    { id: 'museu', icon: '🔮', label: 'Dentro do Museu' },
    { id: 'memorial', icon: '📜', label: 'Memorial' },
    { id: 'reliquias', icon: '🗃️', label: 'Relíquias' },
    { id: 'ranking', icon: '🏅', label: 'Ranking do Caos' },
    { id: 'conquistas', icon: '🎖️', label: 'Conquistas' },
    { id: 'timeline', icon: '⌛', label: 'Linha do Tempo', section: 'Explorar' },
    { id: 'comunidade', icon: '👥', label: 'Comunidade' },
    { id: 'sobre', icon: 'ℹ️', label: 'Sobre o Museu' }
  ];

  return (
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo-icon">
          🏛️
        </div>
        <div className="logo-text">
          <strong>MUSEU</strong>
          <span>DAS IDEIAS ABANDONADAS</span>
        </div>
      </div>

      <nav>
        <div className="nav-label">Navegação</div>
        <div>
          {menuItems.map((item) => (
            <div key={`${item.label}-${item.icon}`}>
              {item.section ? <div className="nav-label">{item.section}</div> : null}
              <button
                type="button"
                onClick={() => {
                  setActiveLabel(item.label);
                  onNavigate(item.id);
                }}
                className={`nav-item ${activeLabel === item.label ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            </div>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div>Visitantes hoje</div>
        <div className="visitor-count">
          <div className="visitor-dot"></div>
          <strong>1.247</strong>
        </div>
        <div style={{ marginTop: '10px' }}>
          <ApiStatus />
        </div>
      </div>
    </aside>
  );
}
