/**
 * ModalContent - Conteúdo dos modais do Museu
 * Centraliza os textos e estruturas dos diferentes modais
 */

export const MODAL_CONTENTS = {
  about: {
    title: 'Sobre o Museu',
    content: (
      <>
        <p>
          O <strong>Museu das Ideias Abandonadas</strong> é um espaço digital dedicado a preservar, 
          celebrar e analisar projetos que nunca saíram do papel.
        </p>
        
        <p>
          Aqui, cada ideia abandonada é tratada com a dignidade que merece. Não importa se foi 
          um app revolucionário, uma startup mirabolante ou um projeto pessoal ambicioso — 
          todos os fracassos são bem-vindos.
        </p>

        <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-4 my-4">
          <p className="text-sm">
            <strong>Nossa Missão:</strong> Transformar o fracasso em arte, o abandono em sabedoria 
            e a procrastinação em uma experiência memorável.
          </p>
        </div>

        <p>
          Usando inteligência artificial e um toque de sarcasmo existencial, a <strong>Curadora do Caos</strong> 
          analisa cada ideia com profundidade, poesia e humor — porque nem tudo na vida precisa ser levado a sério.
        </p>

        <p className="text-xs text-[#6a5c8a] italic">
          Fundado em 2019 · Preservando sonhos desde então
        </p>
      </>
    )
  },

  memorial: {
    title: 'Memorial das Ideias',
    content: (
      <>
        <p>
          Este é o memorial sagrado onde cada ideia abandonada encontra seu lugar na história.
        </p>

        <div className="space-y-4">
          <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-4">
            <h3 className="text-[#c4a8ff] font-semibold mb-2">💀 Ideias Catalogadas</h3>
            <p className="text-sm">
              Mais de 1.247 ideias já passaram pela análise da Curadora do Caos, cada uma com sua 
              própria história de fracasso e aprendizado.
            </p>
          </div>

          <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-4">
            <h3 className="text-[#c4a8ff] font-semibold mb-2">🎭 Categorias</h3>
            <p className="text-sm">
              Apps, Startups, Projetos Pessoais, SaaS, E-commerce, Jogos, Blogs e muito mais. 
              Cada categoria tem seu próprio espaço no museu.
            </p>
          </div>

          <div className="bg-[rgba(180,140,255,0.05)] border border-[rgba(180,140,255,0.15)] rounded-lg p-4">
            <h3 className="text-[#c4a8ff] font-semibold mb-2">🔮 Análise por IA</h3>
            <p className="text-sm">
              Cada ideia recebe uma análise profunda: porcentagem de sobrevivência, causa da morte 
              e um veredito sarcástico mas reconfortante.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#6a5c8a] italic mt-4">
          "Todo fracasso é um passo em direção ao sucesso" — Curadora do Caos
        </p>
      </>
    )
  }
};
