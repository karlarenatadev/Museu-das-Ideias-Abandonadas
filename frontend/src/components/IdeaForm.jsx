/**
 * Formulário para submissão de ideias abandonadas
 * Coleta dados do usuário e envia para análise da IA
 */

import { useState } from 'react';
import { analyzeIdea } from '../services/ideaService';
import AnalysisResult from './AnalysisResult';

export default function IdeaForm() {
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
    
    // Validação básica
    if (!formData.nome.trim() || !formData.categoria || !formData.motivo.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeIdea(formData);
      setResult(analysis);
      
      // Scroll para o resultado
      setTimeout(() => {
        const resultElement = document.querySelector('.analysis-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao processar a ideia.');
      console.error('Erro completo:', err);
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
    <div className="max-w-4xl mx-auto px-3 sm:px-5">
      {/* Formulário */}
      <div className="bg-[#161020] border border-[rgba(180,140,255,0.15)] rounded-xl p-12 sm:p-14 mb-8">
        <div className="mb-10">
          <h2 className="font-['Cinzel'] text-2xl text-[#c4a8ff] mb-2">
            Confesse sua Ideia Abandonada
          </h2>
          <p className="text-sm text-[#a898c8]">
            Compartilhe conosco o projeto que nunca saiu do papel. A Curadora do Caos está pronta para julgar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nome da Ideia */}
          <div>
            <label className="block text-sm font-medium text-[#c4a8ff] mb-3">
              Nome da Ideia <span className="text-[#e06060]">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-6 py-4 bg-[#0f0b18] border border-[rgba(180,140,255,0.2)] rounded-lg text-[#e8e0f5] placeholder-[#6a5c8a] focus:outline-none focus:border-[#7c5ce8] focus:ring-2 focus:ring-[rgba(124,92,232,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ex: App de delivery de sonhos"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-[#c4a8ff] mb-3">
              Categoria <span className="text-[#e06060]">*</span>
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-6 py-4 bg-[#0f0b18] border border-[rgba(180,140,255,0.2)] rounded-lg text-[#e8e0f5] focus:outline-none focus:border-[#7c5ce8] focus:ring-2 focus:ring-[rgba(124,92,232,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div>
            <label className="block text-sm font-medium text-[#c4a8ff] mb-3">
              Empolgação Inicial: <span className="text-[#e8b86d] font-bold">{formData.empolgacao}/5</span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#6a5c8a]">😐 Meh</span>
              <input
                type="range"
                name="empolgacao"
                min="1"
                max="5"
                value={formData.empolgacao}
                onChange={handleChange}
                disabled={loading}
                className="flex-1 h-2 bg-[#0f0b18] rounded-lg appearance-none cursor-pointer accent-[#7c5ce8] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-xs text-[#6a5c8a]">🔥 Hype</span>
            </div>
          </div>

          {/* Motivo do Abandono */}
          <div>
            <label className="block text-sm font-medium text-[#c4a8ff] mb-3">
              Por que foi abandonada? <span className="text-[#e06060]">*</span>
            </label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
              disabled={loading}
              rows="4"
              className="w-full px-6 py-4 bg-[#0f0b18] border border-[rgba(180,140,255,0.2)] rounded-lg text-[#e8e0f5] placeholder-[#6a5c8a] focus:outline-none focus:border-[#7c5ce8] focus:ring-2 focus:ring-[rgba(124,92,232,0.2)] transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Conte-nos a triste (ou hilária) história do abandono..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#7c5ce8] to-[#c4a8ff] text-white font-medium py-3.5 px-7 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform duration-150"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block">⏳</span>
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
                className="px-7 py-3.5 border border-[rgba(180,140,255,0.3)] text-[#c4a8ff] rounded-lg hover:bg-[rgba(180,140,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform duration-150"
              >
                Nova Análise
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-6 rounded-xl border border-[rgba(224,96,96,0.35)] bg-[#2d1a1a] p-6 animate-slideDown">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💀</span>
            <div className="flex-1">
              <h3 className="text-[#e06060] font-semibold mb-1">
                Erro ao Processar
              </h3>
              <p className="text-[#d4a8a8] text-sm">
                {error}
              </p>
              <p className="text-[#a88888] text-xs mt-2">
                💡 Dica: Certifique-se de que o backend está rodando em http://localhost:3001
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="analysis-result">
          <AnalysisResult data={result} ideaName={formData.nome} />
        </div>
      )}
    </div>
  );
}
