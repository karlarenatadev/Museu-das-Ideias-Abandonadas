/**
 * Componente que exibe o resultado da análise da IA
 * Mostra a porcentagem de sobrevivência, causa da morte e veredito
 */

export default function AnalysisResult({ data, ideaName }) {
  const { survival_percentage, cause_of_death_summary, ai_verdict } = data;

  // Define a cor baseada na porcentagem de sobrevivência
  const getColorClass = (percentage) => {
    if (percentage >= 70) return 'text-[#6dd47e]'; // Verde
    if (percentage >= 40) return 'text-[#e8b86d]'; // Amarelo
    return 'text-[#e06060]'; // Vermelho
  };

  const getEmoji = (percentage) => {
    if (percentage >= 70) return '🌟';
    if (percentage >= 40) return '⚠️';
    return '💀';
  };

  return (
    <div className="bg-gradient-to-br from-[#1a0f30] via-[#0d0820] to-[#1a1030] border border-[rgba(180,140,255,0.2)] rounded-xl p-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-[rgba(180,140,255,0.15)]">
        <div className="text-xs tracking-widest uppercase text-[#e8b86d] mb-2">
          Análise Completa
        </div>
        <h3 className="font-['Cinzel'] text-xl text-[#c4a8ff] mb-1">
          {ideaName}
        </h3>
        <p className="text-xs text-[#6a5c8a]">
          Avaliado pela Curadora do Caos
        </p>
      </div>

      {/* Porcentagem de Sobrevivência */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-[rgba(180,140,255,0.05)] border-4 border-[rgba(180,140,255,0.2)] mb-4">
          <div>
            <div className={`text-5xl font-bold ${getColorClass(survival_percentage)}`}>
              {survival_percentage}%
            </div>
            <div className="text-xs text-[#6a5c8a] mt-1">
              Sobrevivência
            </div>
          </div>
        </div>
        <div className="text-3xl mb-2">
          {getEmoji(survival_percentage)}
        </div>
      </div>

      {/* Causa da Morte */}
      <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💀</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#c4a8ff] mb-2 uppercase tracking-wide">
              Causa da Morte
            </h4>
            <p className="text-[#e8e0f5] italic leading-relaxed">
              "{cause_of_death_summary}"
            </p>
          </div>
        </div>
      </div>

      {/* Veredito da IA */}
      <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎭</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#c4a8ff] mb-2 uppercase tracking-wide">
              Veredito da Curadora do Caos
            </h4>
            <p className="text-[#a898c8] leading-relaxed">
              {ai_verdict}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-[rgba(180,140,255,0.15)] text-center">
        <p className="text-xs text-[#6a5c8a] italic">
          "Todo fracasso é uma obra de arte em construção" - Curadora do Caos
        </p>
      </div>
    </div>
  );
}
