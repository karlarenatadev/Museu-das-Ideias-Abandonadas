/**
 * MuseumModal - Modal elegante com estética "Quadro do Louvre Dark Mode"
 * Componente reutilizável para exibir conteúdo em popups flutuantes
 */

import { useEffect } from 'react';

export default function MuseumModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClassName = 'max-w-2xl',
  contentClassName = '',
  hideFooter = false
}) {
  // Fecha o modal ao pressionar ESC
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

  return (
    <>
      {/* Backdrop com blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal - Quadro do Louvre */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className={`w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto`}>
          {/* Borda externa (escura) */}
          <div className="bg-[#0a0608] p-1 rounded-lg shadow-2xl">
            {/* Borda interna (dourada envelhecida) */}
            <div className="bg-gradient-to-br from-[#e8b86d]/20 to-[#c4a8ff]/10 p-1 rounded-md">
              {/* Conteúdo interno */}
              <div className="bg-[#0f0b18] rounded-sm p-8 border border-[rgba(232,184,109,0.15)]">
                
                {/* Header do Modal */}
                <div className="mb-6 pb-6 border-b border-[rgba(180,140,255,0.15)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs tracking-widest uppercase text-[#e8b86d] mb-2">
                        ✦ Museu das Ideias Abandonadas ✦
                      </div>
                      <h2 className="font-['Cinzel'] text-3xl font-bold text-[#c4a8ff]">
                        {title}
                      </h2>
                    </div>
                    
                    {/* Botão Fechar */}
                    <button
                      onClick={onClose}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(180,140,255,0.1)] text-[#c4a8ff] hover:bg-[rgba(180,140,255,0.2)] transition-colors"
                      aria-label="Fechar modal"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className={`text-[#a898c8] leading-relaxed space-y-4 ${contentClassName}`}>
                  {children}
                </div>

                {/* Footer decorativo */}
                {!hideFooter && (
                  <div className="mt-8 pt-6 border-t border-[rgba(180,140,255,0.15)] text-center">
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
    </>
  );
}
