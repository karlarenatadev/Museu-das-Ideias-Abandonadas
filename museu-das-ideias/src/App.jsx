import React from 'react';

export default function App() {
  return (
    // Fundo geral usando a sua cor --bg (#0f0b18) e fonte DM Sans
    <div className="min-h-screen bg-[#0f0b18] text-[#e8e0f5] font-['DM_Sans'] flex">
      
      {/* ─── SIDEBAR (Fixo na esquerda) ─── */}
      <aside className="w-[220px] fixed top-0 left-0 h-screen bg-[#161020] border-r border-[rgba(180,140,255,0.15)] flex flex-col z-50">
        <div className="p-5 border-b border-[rgba(180,140,255,0.15)] flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7c5ce8] to-[#c4a8ff] rounded-xl flex items-center justify-center text-xl">
            🏛️
          </div>
          <div className="leading-tight">
            <strong className="block font-['Cinzel'] text-[11px] font-bold text-[#c4a8ff] tracking-widest">
              MUSEU
            </strong>
            <span className="text-[9px] text-[#6a5c8a] tracking-widest uppercase">
              DAS IDEIAS ABANDONADAS
            </span>
          </div>
        </div>
        {/* Aqui depois criaremos o componente de Menu */}
        <div className="p-5 text-sm text-[#a898c8]">
          [ Menu de Navegação Aqui ]
        </div>
      </aside>

      {/* ─── CONTEÚDO PRINCIPAL (Empurrado para a direita pela Sidebar) ─── */}
      <main className="ml-[220px] flex-1 min-h-screen flex flex-col">
        
        {/* TOPBAR */}
        <header className="flex items-center justify-between p-3 px-6 border-b border-[rgba(180,140,255,0.15)] bg-[#161020] sticky top-0 z-40">
          <div className="text-xs text-[#6a5c8a]">
            Museu das Ideias Abandonadas · Acervo vivo desde 2019
          </div>
          <button className="relative text-lg text-[#a898c8]">
            🔔
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#e06060] rounded-full border border-[#161020]"></div>
          </button>
        </header>

        {/* ÁREA DO HERO (Bem-vindo) */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0f30] via-[#0d0820] to-[#1a1030] p-10 border-b border-[rgba(180,140,255,0.15)]">
          <div className="relative z-10 max-w-lg">
            <div className="text-[11px] tracking-widest uppercase text-[#e8b86d] mb-2 flex items-center gap-2">
              <span className="w-5 h-[1px] bg-[#e8b86d]"></span> Bem-vindo ao
            </div>
            <h1 className="font-['Cinzel'] text-4xl font-bold text-white mb-4 leading-tight">
              Museu das Ideias Abandonadas
            </h1>
            <p className="text-[#a898c8] text-sm mb-6">
              Preservamos sonhos interrompidos, planos mirabolantes e projetos que não viraram realidade.
            </p>
          </div>
          {/* Estátua de fundo */}
          <div className="absolute right-10 top-0 bottom-0 flex items-center opacity-20 text-[160px] pointer-events-none sepia hue-rotate-180">
            🗿
          </div>
        </section>

        {/* RESTANTE DO CONTEÚDO (Grid de ideias, Formulário, etc) */}
        <section className="p-6">
           <h2 className="font-['Cinzel'] text-2xl text-[#c4a8ff]">Próximos componentes virão aqui...</h2>
        </section>

      </main>
    </div>
  );
}