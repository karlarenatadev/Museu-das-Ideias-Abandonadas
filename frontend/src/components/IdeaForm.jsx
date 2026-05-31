import { useState } from 'react';
import { analyzeIdea } from '../services/ideaService';
import AnalysisResult from './AnalysisResult';
import { playRandomAudio } from '../services/audioRandomizer';

const formStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0%, 100% { background-position: 200% 0; }
    50% { background-position: -200% 0; }
  }

  .form-field {
    animation: slideInUp 0.5s ease-out forwards;
  }

  .form-field:nth-child(1) { animation-delay: 0.1s; }
  .form-field:nth-child(2) { animation-delay: 0.2s; }
  .form-field:nth-child(3) { animation-delay: 0.3s; }
  .form-field:nth-child(4) { animation-delay: 0.4s; }

  .form-input, .form-select, .form-textarea {
    background: linear-gradient(135deg, #0a0608, #161020);
    border: 1px solid rgba(180, 140, 255, 0.2);
    color: #e8e0f5;
    transition: all 0.3s ease;
  }

  .form-input:focus, .form-select:focus, .form-textarea:focus {
    background: linear-gradient(135deg, #161020, #1e1630);
    border-color: rgba(180, 140, 255, 0.6);
    box-shadow: 0 0 20px rgba(155, 127, 244, 0.3), inset 0 0 10px rgba(155, 127, 244, 0.05);
    outline: none;
  }

  .form-input::placeholder, .form-textarea::placeholder {
    color: #6a5c8a;
  }

  .form-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #c4a8ff;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.85rem;
  }

  .form-label-value {
    color: #e8b86d;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .form-range {
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg,
      rgba(180, 140, 255, 0.2) 0%,
      rgba(155, 127, 244, 0.3) 50%,
      rgba(180, 140, 255, 0.2) 100%);
    border-radius: 10px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }

  .form-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #7c5ce8, #c4a8ff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(155, 127, 244, 0.6), inset 0 0 4px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(232, 184, 109, 0.4);
    transition: all 0.2s ease;
  }

  .form-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(155, 127, 244, 0.8);
  }

  .form-range::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #7c5ce8, #c4a8ff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(155, 127, 244, 0.6);
    border: 2px solid rgba(232, 184, 109, 0.4);
    transition: all 0.2s ease;
  }

  .form-range::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(155, 127, 244, 0.8);
  }

  .btn-primary {
    background: linear-gradient(135deg, #7c5ce8, #c4a8ff);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 8px;
    padding: 14px 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(155, 127, 244, 0.3);
    flex: 1;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(155, 127, 244, 0.5);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: transparent;
    color: #c4a8ff;
    border: 2px solid rgba(180, 140, 255, 0.4);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 8px;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(180, 140, 255, 0.15);
    border-color: rgba(180, 140, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(155, 127, 244, 0.2);
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .emotion-meter {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .emotion-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(180, 140, 255, 0.2);
    transition: all 0.3s ease;
  }

  .emotion-dot.active {
    background: linear-gradient(135deg, #7c5ce8, #c4a8ff);
    box-shadow: 0 0 8px rgba(155, 127, 244, 0.6);
  }
`;

export default function IdeaForm({ onIdeaAdded }) {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    empolgacao: 3,
    motivo: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    playRandomAudio('Analisar Ideia');

    try {
      const analysis = await analyzeIdea(formData);
      setResult(analysis);

      if (onIdeaAdded && typeof onIdeaAdded === 'function') {
        onIdeaAdded(analysis);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'empolgacao' ? Number(value) : value
    }));
  };

  const handleReset = () => {
    setFormData({
      nome: '',
      categoria: '',
      empolgacao: 3,
      motivo: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ width: '100%' }}>
      <style>{formStyles}</style>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Nome da Ideia */}
        <div className="form-field">
          <label className="form-label">
            <span>💡 Nome da Ideia</span>
            <span style={{ fontSize: '0.75rem', color: '#6a5c8a', fontWeight: 'normal', textTransform: 'lowercase', letterSpacing: 'normal' }}>obrigatório</span>
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-input"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '10px',
              fontSize: '14px'
            }}
            placeholder="Ex: App de delivery de sonhos"
          />
        </div>

        {/* Categoria */}
        <div className="form-field">
          <label className="form-label">
            <span>🎭 Categoria da Ideia</span>
            <span style={{ fontSize: '0.75rem', color: '#6a5c8a', fontWeight: 'normal', textTransform: 'lowercase', letterSpacing: 'normal' }}>obrigatório</span>
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-select"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '10px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">Selecione uma categoria...</option>
            <option value="App">📱 App</option>
            <option value="Startup">🚀 Startup</option>
            <option value="Projeto Pessoal">💡 Projeto Pessoal</option>
            <option value="SaaS">☁️ SaaS</option>
            <option value="E-commerce">🛒 E-commerce</option>
            <option value="Jogo">🎮 Jogo</option>
            <option value="Blog/Conteúdo">✍️ Blog/Conteúdo</option>
            <option value="Outro">🎯 Outro</option>
          </select>
        </div>

        {/* Empolgação */}
        <div className="form-field">
          <label className="form-label">
            <span>🔥 Nível de Empolgação Inicial</span>
            <span className="form-label-value">{formData.empolgacao}/5</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6a5c8a', minWidth: '30px' }}>😐</span>
            <input
              type="range"
              name="empolgacao"
              min="1"
              max="5"
              value={formData.empolgacao}
              onChange={handleChange}
              disabled={loading}
              className="form-range"
            />
            <span style={{ fontSize: '12px', color: '#6a5c8a', minWidth: '30px' }}>🔥</span>
          </div>
          <div className="emotion-meter">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`emotion-dot ${formData.empolgacao >= num ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Motivo do Abandono */}
        <div className="form-field">
          <label className="form-label">
            <span>💔 Por que foi abandonada?</span>
            <span style={{ fontSize: '0.75rem', color: '#6a5c8a', fontWeight: 'normal', textTransform: 'lowercase', letterSpacing: 'normal' }}>obrigatório</span>
          </label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            required
            disabled={loading}
            rows="5"
            className="form-textarea"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '10px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none'
            }}
            placeholder="Conte-nos a triste (ou hilária) história do abandono..."
          />
          <div style={{ fontSize: '12px', color: '#6a5c8a', marginTop: '6px' }}>
            {formData.motivo.length}/500 caracteres
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ fontSize: '14px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                Analisando...
              </span>
            ) : (
              '🔮 Analisar Ideia'
            )}
          </button>

          {(result || error) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="btn-secondary"
              style={{ fontSize: '14px' }}
            >
              ↻ Nova Análise
            </button>
          )}
        </div>
      </form>

      {/* Erro */}
      {error && (
        <div style={{
          marginTop: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(224, 96, 96, 0.35)',
          background: 'rgba(224, 96, 96, 0.1)',
          padding: '20px',
          animation: 'slideInUp 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <span style={{ fontSize: '24px', minWidth: '32px' }}>💀</span>
            <div>
              <h3 style={{
                color: '#e06060',
                fontWeight: 'bold',
                marginBottom: '6px',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Erro ao Processar
              </h3>
              <p style={{
                color: '#d4a8a8',
                fontSize: '13px',
                lineHeight: '1.5',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div style={{ marginTop: '24px', animation: 'slideInUp 0.5s ease-out' }}>
          <AnalysisResult data={result} ideaName={formData.nome} />
        </div>
      )}
    </div>
  );
}
