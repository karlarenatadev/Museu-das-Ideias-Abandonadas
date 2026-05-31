import { useState } from 'react';

/**
 * Card de ideia melhorado com interatividade
 * - Cores dinâmicas por categoria
 * - Hover states ricos
 * - Animações suaves
 */
export default function IdeaCardEnhanced({ idea, categoryColors, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [candleCount, setCandleCount] = useState(0);

  const colors = categoryColors[idea.categoria] || categoryColors['Outros'];

  const handleCandleClick = (e) => {
    e.stopPropagation();
    setCandleCount(prev => prev + 1);
  };

  return (
    <div
      className="idea-card-enhanced"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(idea)}
      style={{
        '--card-accent': colors.accent,
        '--card-gradient': colors.gradient,
      }}
    >
      {/* Candle Counter */}
      {candleCount > 0 && (
        <div className="candle-badge" style={{ animation: 'slideDown 0.3s ease' }}>
          <span className="candle-flame">🕯️</span>
          {candleCount > 1 && <span className="candle-count">{candleCount}</span>}
        </div>
      )}

      {/* Thumbnail */}
      <div
        className="idea-thumb-enhanced"
        style={{ background: colors.gradient }}
      >
        <span className="idea-icon" style={{ transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1)' }}>
          {idea.icon}
        </span>
        <div className="idea-rip">🪦 RIP</div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="idea-overlay" style={{ animation: 'fadeIn 0.2s ease' }}>
            <button className="overlay-btn" onClick={handleCandleClick}>
              🕯️ Acender
            </button>
            <button className="overlay-btn">💬 Homenagear</button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="idea-body-enhanced">
        <div className="idea-name">{idea.nome}</div>
        <div className="idea-dates">{idea.dates}</div>
        <div className="idea-cause">
          <strong>Causa:</strong> {idea.cause}
        </div>
        <div className="idea-survival" style={{ marginTop: '8px' }}>
          <div className="survival-bar">
            <div
              className="survival-fill"
              style={{
                width: `${idea.survival_percentage}%`,
                background: `linear-gradient(90deg, var(--card-accent), ${colors.accent}88)`,
              }}
            />
          </div>
          <span className="survival-text">{idea.survival_percentage}% sobrevivência</span>
        </div>
      </div>
    </div>
  );
}
