import { useEffect } from 'react';
import { playMuseumCue } from '../services/museumAudio';

const styles = `
  @keyframes fadeInBackdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleUpModal {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .form-modal-backdrop {
    animation: fadeInBackdrop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .form-modal-content {
    animation: scaleUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

export default function FormModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    playMuseumCue('modal');

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      styleElement.remove();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="form-modal-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'rgba(15, 11, 24, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer'
        }}
        onClick={onClose}
      />

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '1.5rem',
        pointerEvents: 'none'
      }}>
        <div
          className="form-modal-content"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '50rem',
            maxHeight: '90vh',
            pointerEvents: 'auto',
            overflow: 'auto'
          }}
        >
          {/* Borda externa (escura) */}
          <div style={{
            background: '#0a0608',
            padding: '1px',
            borderRadius: '12px',
            border: '1px solid rgba(180, 140, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(155, 127, 244, 0.15)'
          }}>
            {/* Borda interna (dourada envelhecida) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(232, 184, 109, 0.1), rgba(196, 168, 255, 0.05))',
              padding: '1px',
              borderRadius: '11px'
            }}>
              {/* Conteúdo principal */}
              <div style={{
                borderRadius: '10px',
                border: '1px solid rgba(232, 184, 109, 0.15)',
                background: '#161020',
                padding: '48px',
                position: 'relative'
              }}>
                {/* Botão Fechar */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: 'rgba(180, 140, 255, 0.15)',
                    color: '#c4a8ff',
                    border: '1px solid rgba(180, 140, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '18px',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(180, 140, 255, 0.25)';
                    e.target.style.transform = 'rotate(90deg)';
                    e.target.style.boxShadow = '0 0 12px rgba(196, 168, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(180, 140, 255, 0.15)';
                    e.target.style.transform = 'rotate(0deg)';
                    e.target.style.boxShadow = 'none';
                  }}
                  aria-label="Fechar formulário"
                >
                  ✕
                </button>

                {/* Header */}
                <div style={{
                  marginBottom: '32px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(180, 140, 255, 0.15)'
                }}>
                  <div style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#e8b86d',
                    marginBottom: '12px',
                    fontWeight: '600'
                  }}>
                    ✦ Formulário de Inscrição ✦
                  </div>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#c4a8ff',
                    fontFamily: "'Cinzel', serif",
                    margin: 0
                  }}>
                    Confesse sua Ideia
                  </h2>
                </div>

                {/* Conteúdo do formulário */}
                <div style={{
                  color: '#a898c8',
                  lineHeight: '1.6'
                }}>
                  {children}
                </div>

                {/* Footer decorativo */}
                <div style={{
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(180, 140, 255, 0.15)',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#6a5c8a',
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    "Nem todo fracasso é uma derrota... às vezes é apenas uma coleção."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
