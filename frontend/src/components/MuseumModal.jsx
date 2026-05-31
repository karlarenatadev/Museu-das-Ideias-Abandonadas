/**
 * MuseumModal - Modal elegante com estética "Quadro do Louvre Dark Mode"
 * Componente reutilizável para exibir conteúdo em popups flutuantes
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function MuseumModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClassName = 'max-w-2xl',
  contentClassName = '',
  hideFooter = false
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop com blur */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
        className="animate-fadeIn"
      />

      {/* Modal - Quadro do Louvre */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
        className="animate-fadeIn"
      >
        <div style={{
          width: '100%',
          maxWidth: '42rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          {/* Borda externa (escura) */}
          <div className="bg-[#0a0608] p-1 rounded-lg shadow-2xl" style={{ border: '1px solid rgba(180, 140, 255, 0.1)' }}>
            {/* Borda interna (dourada envelhecida) */}
            <div className="bg-gradient-to-br from-[#e8b86d]/20 to-[#c4a8ff]/10 p-1 rounded-md">
              {/* Conteúdo interno com Card roxo */}
              <div className="rounded-sm border border-[rgba(232,184,109,0.15)]" style={{ position: 'relative', background: '#161020', padding: '48px' }}>

                {/* Botão Fechar - posicionado à direita superior */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: 'rgba(180, 140, 255, 0.15)',
                    color: '#c4a8ff',
                    border: '1px solid rgba(180, 140, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    fontSize: '18px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(180, 140, 255, 0.25)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(180, 140, 255, 0.15)'}
                  aria-label="Fechar modal"
                >
                  ✕
                </button>

                {/* Header do Modal */}
                <div className="mb-8 pb-8 border-b border-[rgba(180,140,255,0.15)]">
                  <div>
                    <div className="text-xs tracking-widest uppercase text-[#e8b86d] mb-3">
                      ✦ Museu das Ideias Abandonadas ✦
                    </div>
                    <h2 className="font-['Cinzel'] text-3xl font-bold text-[#c4a8ff]">
                      {title}
                    </h2>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className={`text-[#a898c8] leading-relaxed space-y-10 ${contentClassName}`}>
                  {children}
                </div>

                {/* Footer decorativo */}
                {!hideFooter && (
                  <div className="mt-10 pt-8 border-t border-[rgba(180,140,255,0.15)] text-center">
                    <p className="text-xs text-[#6a5c8a] italic">
                      "Cada ideia abandonada é uma obra de arte em construção"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
