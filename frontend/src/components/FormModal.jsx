import { useEffect } from 'react';
import MuseumAtmosphere from './MuseumAtmosphere';
import { playMuseumCue } from '../services/museumAudio';

export default function FormModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
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
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="museum-modal-backdrop fixed inset-0 z-40 bg-black/55 backdrop-blur-sm" onClick={onClose}>
        <MuseumAtmosphere variant="modal" />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-10">
        <div className="relative w-full max-w-4xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 rounded-lg border border-[rgba(180,140,255,0.35)] bg-[#0f0b18]/90 px-2.5 py-1.5 text-sm text-[#c4a8ff] hover:bg-[rgba(180,140,255,0.18)]"
            aria-label="Fechar formulário"
          >
            ✕
          </button>

          <div className="museum-stone-panel rounded-2xl border border-[rgba(180,140,255,0.18)] bg-[rgba(15,11,24,0.45)] p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
