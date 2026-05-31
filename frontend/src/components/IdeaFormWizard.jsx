import { useState } from 'react';
import { analyzeIdea } from '../services/ideaService';

/**
 * Formulário de ideia em formato wizard (passo a passo)
 * Melhor UX com progresso visual
 */
export default function IdeaFormWizard({ onIdeaAdded, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    empolgacao: 3,
    motivo: ''
  });

  const categories = [
    { value: 'Empreendedorismo', emoji: '🚀', label: 'Startup/Negócio' },
    { value: 'Criativas', emoji: '🎨', label: 'Projeto Criativo' },
    { value: 'Fitness', emoji: '💪', label: 'Fitness/Saúde' },
    { value: 'Estudos', emoji: '📚', label: 'Aprendizado' },
    { value: 'Hobbies', emoji: '🎮', label: 'Hobby/Diversão' },
    { value: 'Organização', emoji: '📋', label: 'Organização' },
    { value: 'Outros', emoji: '🎯', label: 'Outro' }
  ];

  const handleNext = () => {
    if (step === 1 && !formData.nome.trim()) {
      setError('Digite o nome da ideia');
      return;
    }
    if (step === 2 && !formData.categoria) {
      setError('Selecione uma categoria');
      return;
    }
    if (step === 3 && !formData.motivo.trim()) {
      setError('Descreva o motivo do abandono');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeIdea(formData);
      onIdeaAdded?.(result);
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-text">Passo {step} de 4</div>
      </div>

      {/* Step 1: Nome */}
      {step === 1 && (
        <div className="wizard-step" style={{ animation: 'slideIn 0.3s ease' }}>
          <h2>Como se chama sua ideia?</h2>
          <p>Dê um nome criativo e memorável</p>
          <input
            type="text"
            placeholder="Ex: App de delivery de sonhos"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="wizard-input"
            autoFocus
          />
        </div>
      )}

      {/* Step 2: Categoria */}
      {step === 2 && (
        <div className="wizard-step" style={{ animation: 'slideIn 0.3s ease' }}>
          <h2>Qual é a categoria?</h2>
          <p>Escolha a que melhor descreve sua ideia</p>
          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-btn ${formData.categoria === cat.value ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, categoria: cat.value })}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Empolgação */}
      {step === 3 && (
        <div className="wizard-step" style={{ animation: 'slideIn 0.3s ease' }}>
          <h2>Qual era seu nível de empolgação?</h2>
          <p>De 😐 (meh) até 🔥 (hype total)</p>
          <div className="mood-selector-wizard">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`mood-btn ${formData.empolgacao === num ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, empolgacao: num })}
              >
                {num === 1 && '😐'}
                {num === 2 && '🙂'}
                {num === 3 && '😊'}
                {num === 4 && '😍'}
                {num === 5 && '🔥'}
              </button>
            ))}
          </div>
          <div className="mood-value">Empolgação: {formData.empolgacao}/5</div>
        </div>
      )}

      {/* Step 4: Motivo */}
      {step === 4 && (
        <div className="wizard-step" style={{ animation: 'slideIn 0.3s ease' }}>
          <h2>Por que foi abandonada?</h2>
          <p>Conte a história triste (ou hilária) do abandono</p>
          <textarea
            placeholder="Descreva o motivo do abandono..."
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            className="wizard-textarea"
            autoFocus
          />
          <div className="char-count">{formData.motivo.length}/500</div>
        </div>
      )}

      {/* Step 5: Preview */}
      {step === 5 && (
        <div className="wizard-step" style={{ animation: 'slideIn 0.3s ease' }}>
          <h2>Confirme os dados</h2>
          <div className="preview-box">
            <div className="preview-item">
              <strong>Nome:</strong> {formData.nome}
            </div>
            <div className="preview-item">
              <strong>Categoria:</strong> {formData.categoria}
            </div>
            <div className="preview-item">
              <strong>Empolgação:</strong> {formData.empolgacao}/5
            </div>
            <div className="preview-item">
              <strong>Motivo:</strong> {formData.motivo}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="wizard-error" style={{ animation: 'slideDown 0.3s ease' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Buttons */}
      <div className="wizard-buttons">
        {step > 1 && (
          <button className="btn-secondary" onClick={handleBack} disabled={loading}>
            ← Voltar
          </button>
        )}
        {step < 5 && (
          <button className="btn-primary" onClick={handleNext} disabled={loading}>
            Próximo →
          </button>
        )}
        {step === 5 && (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? '⏳ Analisando...' : '🔮 Eternizar Ideia'}
          </button>
        )}
      </div>
    </div>
  );
}
