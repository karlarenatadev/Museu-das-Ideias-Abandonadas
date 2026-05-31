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

  const getProgressColor = (percentage) => {
    if (percentage >= 70) return 'from-[#6dd47e] to-[#4db85f]';
    if (percentage >= 40) return 'from-[#e8b86d] to-[#d4a04d]';
    return 'from-[#e06060] to-[#c04040]';
  };

  return (
    <div className="bg-gradient-to-br from-[#1a0f30] via-[#0d0820] to-[#1a1030] border border-[rgba(180,140,255,0.2)] rounded-xl p-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-[rgba(180,140,255,0.15)]">
        <div className="text-xs tracking-widest uppercase text-[#e8b86d] mb-2 animate-slideDown">
          ✨ Análise Completa
        </div>
        <h3 className="font-['Cinzel'] text-xl text-[#c4a8ff] mb-1 animate-slideDown" style={{ animationDelay: '0.1s' }}>
          {ideaName}
        </h3>
        <p className="text-xs text-[#6a5c8a] animate-slideDown" style={{ animationDelay: '0.2s' }}>
          Avaliado pela Curadora do Caos
        </p>
      </div>

      {/* Porcentagem de Sobrevivência */}
      <div className="text-center mb-8 animate-scaleIn">
        <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-[rgba(180,140,255,0.05)] border-4 border-[rgba(180,140,255,0.2)] mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[rgba(180,140,255,0.3)] animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="relative z-10">
            <div className={`text-5xl font-bold ${getColorClass(survival_percentage)} transition-all duration-500`}>
              {survival_percentage}%
            </div>
            <div className="text-xs text-[#6a5c8a] mt-1">
              Sobrevivência
            </div>
          </div>
        </div>
        <div className="text-4xl mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
          {getEmoji(survival_percentage)}
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-8 px-2">
        <div className="h-3 bg-[#0f0b18] rounded-full overflow-hidden border border-[rgba(180,140,255,0.15)]">
          <div 
            className={`h-full bg-gradient-to-r ${getProgressColor(survival_percentage)} transition-all duration-1000 ease-out`}
            style={{ width: `${survival_percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Causa da Morte */}
      <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-6 mb-6 animate-slideUp">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💀</span>
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
      <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🎭</span>
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
