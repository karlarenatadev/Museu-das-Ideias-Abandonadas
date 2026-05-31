import { useEffect, useState } from 'react';
import './RipModal.css';
import { playRandomAudio } from '../services/audioRandomizer';

export default function RipModal({ isOpen, onClose, idea, onConfirm }) {
  const [showSparkles, setShowSparkles] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (showSparkles) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowSparkles(false);
            setShowCertificate(true);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSparkles]);

  const handleConfirm = () => {
    playRandomAudio('RIP');
    setShowSparkles(true);
  };

  const handleCertificateClose = async () => {
    setShowCertificate(false);
    await onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Sparkles Effect */}
      {showSparkles && <SparklesEffect />}

      {/* RIP Modal */}
      {!showCertificate && (
        <div className="rip-modal-overlay" onClick={onClose}>
          <div className="rip-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rip-modal-header">
              <div className="rip-icon">🪦</div>
              <div className="rip-title">Você REALMENTE quer reviver isso?</div>
            </div>

            <div className="rip-modal-body">
              <div className="rip-idea-name">{idea?.name}</div>
              <div className="rip-warning-box">
                <div className="rip-warning-icon">⚠️</div>
                <div className="rip-warning-text">
                  <strong>Aviso sério:</strong> Se você ressuscitar esta ideia...
                </div>
              </div>

              <div className="rip-consequences">
                <div className="consequence-item">
                  <span className="consequence-emoji">👻</span>
                  <span className="consequence-text">Você será permanentemente banido do aplicativo</span>
                </div>
                <div className="consequence-item">
                  <span className="consequence-emoji">💀</span>
                  <span className="consequence-text">Um certificado de morte será gerado como prova</span>
                </div>
                <div className="consequence-item">
                  <span className="consequence-emoji">✨</span>
                  <span className="consequence-text">A ideia será DELETADA para sempre (sem undo)</span>
                </div>
                <div className="consequence-item">
                  <span className="consequence-emoji">😱</span>
                  <span className="consequence-text">Você vai se arrepender no futuro, com certeza</span>
                </div>
              </div>

              <div className="rip-moral-text">
                "Nem tudo que está morto precisa reviver."<br/>
                <span style={{ fontSize: '11px', color: '#a89cc4' }}>— Curadora do Caos</span>
              </div>
            </div>

            <div className="rip-modal-footer">
              <button type="button" className="rip-btn-cancel" onClick={onClose}>
                Não, deixa quieto
              </button>
              <button type="button" className="rip-btn-confirm" onClick={handleConfirm}>
                Sim, deletar para sempre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Death Certificate */}
      {showCertificate && (
        <div className="rip-modal-overlay" onClick={handleCertificateClose}>
          <div className="rip-certificate" onClick={(e) => e.stopPropagation()}>
            <div className="certificate-bg">
              <div className="certificate-header">
                <div className="certificate-seal">🪦</div>
                <h2>CERTIDÃO DE MORTE</h2>
              </div>

              <div className="certificate-line"></div>

              <div className="certificate-body">
                <p className="cert-label">RESPEITO POR</p>
                <p className="cert-name">{idea?.name}</p>

                <p className="cert-label" style={{ marginTop: '20px' }}>PERÍODO DE VIDA</p>
                <p className="cert-dates">{idea?.dates}</p>

                <p className="cert-label" style={{ marginTop: '20px' }}>CAUSA OFICIAL DA MORTE</p>
                <p className="cert-cause">{idea?.cause}</p>

                <p className="cert-label" style={{ marginTop: '20px' }}>MORTE POR RESSURREIÇÃO</p>
                <p className="cert-date-today">Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="certificate-footer">
                <p className="cert-final-message">
                  "Descansa em Paz. Sua ressurreição foi um sucesso... de morte."
                </p>
                <p className="cert-signature">Assinado pela Curadora do Caos 💀</p>
              </div>
            </div>

            <div className="certificate-controls">
              <button
                type="button"
                className="btn-print"
                onClick={() => window.print()}
              >
                🖨️ Imprimir Certificado
              </button>
              <button type="button" className="btn-close-cert" onClick={handleCertificateClose}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SparklesEffect() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      const newSparkle = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 0.5
      };
      setSparkles((prev) => [...prev, newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 3000);
    }, 100);

    return () => clearInterval(sparkleInterval);
  }, []);

  return (
    <div className="sparkles-container">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            animationDelay: `${sparkle.delay}s`
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}
