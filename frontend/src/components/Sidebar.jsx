/**
 * Sidebar - Navegação lateral do Museu
 * Gerencia os botões que abrem modais
 */

import ApiStatus from './ApiStatus';
import { useState } from 'react';

export default function Sidebar({ onNavigate }) {
  const [activeLabel, setActiveLabel] = useState('Início');

  const menuItems = [
    { id: 'analyze', icon: '🏛️', label: 'Início' },
    { id: 'analyze', icon: '🔮', label: 'Dentro do Museu' },
    { id: 'memorial', icon: '📜', label: 'Memorial' },
    { id: 'analyze', icon: '🗃️', label: 'Relíquias' },
    { id: 'analyze', icon: '🏅', label: 'Ranking do Caos', badge: '5' },
    { id: 'analyze', icon: '🎖️', label: 'Conquistas' },
    { id: 'analyze', icon: '⌛', label: 'Linha do Tempo', section: 'Explorar' },
    { id: 'analyze', icon: '👥', label: 'Comunidade' },
    { id: 'about', icon: 'ℹ️', label: 'Sobre o Museu' }
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
