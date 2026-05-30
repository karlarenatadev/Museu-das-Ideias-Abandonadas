import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MuseumModal from './components/MuseumModal';
import { MODAL_CONTENTS } from './components/ModalContent';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [activeMemTab, setActiveMemTab] = useState('Sobre');
  const [activeRankTab, setActiveRankTab] = useState('Geral');
  const [selectedMood, setSelectedMood] = useState(4);
  const [abandonReason, setAbandonReason] = useState('');

  const museumCards = [
    { icon: '🕯️', name: 'Loja de Velas Aromáticas', dates: '2022 – 2022', cause: 'Pesquisa excessiva no Pinterest' },
    { icon: '🎬', name: 'Canal de Produtividade', dates: '2023 – 2023', cause: 'Editou o primeiro vídeo e desistiu' },
    { icon: '🇩🇪', name: 'Curso de Alemão B1', dates: '2021 – 2021', cause: 'Duolingo burnout' },
    { icon: '💪', name: 'Projeto Fitness', dates: '2022 – 2023', cause: 'Encontrou pão de alho' },
    { icon: '🎙️', name: 'Podcast sobre Mindset', dates: '2023 – 2023', cause: 'Ninguém ouviu o episódio 1' },
    { icon: '🎨', name: 'Aprender Aquarela', dates: '2022 – 2022', cause: 'Fase existencial' },
    { icon: '🦄', name: 'Startup Inovadora', dates: '2024 – 2024', cause: 'Pitch pro espelho' }
  ];

  const filters = ['Todas', 'Empreendedorismo', 'Estudos', 'Fitness', 'Hobbies', 'Criativas', 'Organização', 'Outros'];
  const emojiScale = ['😴', '😕', '🙂', '😌', '🤩'];
  const survivalPcts = [7, 13, 19, 31, 48];
  const survivalPct = survivalPcts[selectedMood] ?? 13;

  const handleNavigate = (modalId) => {
    if (modalId === 'analyze') {
      setActiveModal(null); // Fecha modal e volta ao formulário
    } else {
      setActiveModal(modalId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div>
      <Sidebar onNavigate={handleNavigate} />

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            Museu das Ideias Abandonadas · Acervo vivo desde 2019
          </div>
          <div className="topbar-right">
            <button className="notif-btn" type="button" aria-label="Notificações">
              🔔
              <div className="notif-dot"></div>
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-statue">🗿</div>
          <div className="hero-inner">
            <div className="hero-tag">Bem-vindo ao</div>
            <h1>Museu das Ideias Abandonadas</h1>
            <p>
              Preservamos sonhos interrompidos, planos mirabolantes e projetos que não viraram realidade.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" type="button">Entrar no Museu ✦</button>
              <button className="btn-outline" type="button">🎫 Fazer visita guiada</button>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-label">Ideias enterradas</div><div className="hero-stat-val">12.842</div></div>
              <div><div className="hero-stat-label">Visitantes</div><div className="hero-stat-val">7.531</div></div>
              <div><div className="hero-stat-label">Memoriais criados</div><div className="hero-stat-val">3.219</div></div>
              <div><div className="hero-stat-label">Anos de promessas</div><div className="hero-stat-val">∞</div></div>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <div className="center-col">
            <div className="sec-header">
              <div>
                <div className="sec-title">Dentro do museu</div>
                <div className="sec-sub">Explore as alas do nosso acervo de sonhos não realizados.</div>
              </div>
            </div>

            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Buscar uma ideia..." />
            </div>

            <div className="filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="ideas-grid">
              {museumCards.map((card) => (
                <div className="idea-card" key={card.name}>
                  <div
                    className="idea-thumb"
                    style={{
                      background:
                        card.name === 'Loja de Velas Aromáticas'
                          ? 'linear-gradient(135deg, #2a1a1a, #3d2020)'
                          : card.name === 'Canal de Produtividade'
                            ? 'linear-gradient(135deg, #1a2a1a, #203520)'
                            : card.name === 'Curso de Alemão B1'
                              ? 'linear-gradient(135deg, #1a1a2a, #202040)'
                              : card.name === 'Projeto Fitness'
                                ? 'linear-gradient(135deg, #201a2a, #30203d)'
                                : card.name === 'Podcast sobre Mindset'
                                  ? 'linear-gradient(135deg, #1a2028, #20283d)'
                                  : card.name === 'Aprender Aquarela'
                                    ? 'linear-gradient(135deg, #28201a, #3d3020)'
                                    : 'linear-gradient(135deg, #1e1a30, #282048)'
                    }}
                  >
                    <span>{card.icon}</span>
                    <div className="idea-rip">🪦 RIP</div>
                  </div>
                  <div className="idea-body">
                    <div className="idea-name">{card.name}</div>
                    <div className="idea-dates">{card.dates}</div>
                    <div className="idea-cause">
                      <strong>Causa da morte:</strong> {card.cause}
                    </div>
                  </div>
                </div>
              ))}

              <div className="add-card">
                <div className="add-card-icon">➕</div>
                <div className="add-card-label">Adicionar nova tragédia</div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="sec-header">
              <div className="sec-title">Memorial de uma ideia</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>◀</button>
                <button type="button" style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>▶</button>
                <button type="button" style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--danger)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>💔</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2a1a1a, #4a2828)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  flexShrink: 0
                }}
              >
                🕯️
              </div>
              <div>
                <div className="memorial-name">Loja de Velas Aromáticas</div>
                <div className="memorial-dates">2022 – 2022</div>
                <div className="memorial-cause-label">Causa da morte</div>
                <div className="memorial-cause-val">Pesquisa excessiva no Pinterest</div>
                <div className="memorial-quote">"Só mais uma ideia que poderia ter mudado tudo."</div>
              </div>
            </div>

            <div className="memorial-tabs">
              {['Sobre', 'Linha do Tempo', 'Relíquias', 'Estatísticas'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`mem-tab ${activeMemTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveMemTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="memorial-cols">
              <div>
                <div className="mem-col-title">Biografia</div>
                <div className="mem-item">Nasceu de um surto de criatividade numa madrugada de domingo. Teve um início promissor, nome, logo, moodboard e até público-alvo imaginário.</div>
              </div>
              <div>
                <div className="mem-col-title">Expectativa</div>
                <div className="mem-item">💸 Independência financeira</div>
                <div className="mem-item" style={{ marginTop: '4px' }}>🏷️ Marca autoral</div>
                <div className="mem-item" style={{ marginTop: '4px' }}>🌿 Vida tranquila no campo</div>
              </div>
              <div>
                <div className="mem-col-title">Realidade</div>
                <div className="mem-item bad">✘ 0 vendas</div>
                <div className="mem-item bad" style={{ marginTop: '4px' }}>✘ 14 abas abertas</div>
                <div className="mem-item bad" style={{ marginTop: '4px' }}>✘ 3 carrinhos abandonados</div>
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="form-card">
              <div className="form-title">Adicionar nova tragédia</div>
              <div className="form-sub">Registre sua ideia para que ela seja eternizada.</div>

              <div className="form-group">
                <label className="form-label">Nome da ideia <span className="req">*</span></label>
                <input className="form-input" type="text" placeholder="Ex: Minha startup que ia mudar o mundo" />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria <span className="req">*</span></label>
                <select className="form-select" defaultValue="">
                  <option value="" disabled>Selecione uma categoria</option>
                  {filters.slice(1).map((filter) => <option key={filter}>{filter}</option>)}
                </select>
              </div>

              <div className="form-row form-group">
                <div>
                  <label className="form-label">Data de início</label>
                  <input className="form-input" type="text" placeholder="dd/mm/aaaa" />
                </div>
                <div>
                  <label className="form-label">Última atividade</label>
                  <input className="form-input" type="text" placeholder="dd/mm/aaaa" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nível de empolgação inicial</label>
                <div className="emoji-rating">
                  {emojiScale.map((emoji, idx) => (
                    <span
                      key={emoji}
                      role="button"
                      tabIndex={0}
                      className={`emoji-btn ${selectedMood === idx ? 'sel' : ''}`}
                      onClick={() => setSelectedMood(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedMood(idx);
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Motivo do abandono <span className="char-count">{abandonReason.length}/300</span></label>
                <textarea
                  className="form-textarea"
                  placeholder="Conte a verdade..."
                  value={abandonReason}
                  onChange={(e) => setAbandonReason(e.target.value.slice(0, 300))}
                ></textarea>
              </div>

              <button className="btn-submit" type="button">✉ Enviar para análise da IA</button>
            </div>

            <div className="prediction-card">
              <div className="prediction-header">
                <div>
                  <div className="pred-title">Previsão de sobrevivência pela IA</div>
                  <div className="pred-sub">Nossa IA analisou e prevê:</div>
                </div>
                <div className="crystal-ball">🔮</div>
              </div>
              <div className="survival-pct">{survivalPct}%</div>
              <div className="survival-label">Boa sorte.</div>
              <div style={{ marginTop: '14px', background: 'var(--bg3)', borderRadius: '8px', overflow: 'hidden', height: '6px' }}>
                <div style={{ width: `${survivalPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--danger), #e88000)', borderRadius: '8px', transition: 'width 0.8s ease' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <section className="bottom-sec">
            <div className="sec-header">
              <div className="sec-title" style={{ fontSize: '14px' }}>Linha do tempo</div>
            </div>
            <div className="timeline">
              <div className="tl-item"><div className="tl-dot"></div><div><div className="tl-day">Dia 1</div><div className="tl-text">Ideia nasceu durante um café e um reels motivacional.</div></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div><div className="tl-day">Dia 2</div><div className="tl-text">Pesquisa de fornecedores e preços.</div></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div><div className="tl-day">Dia 3</div><div className="tl-text">Criação do nome, logo e bio no Instagram.</div></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div><div className="tl-day">Dia 5</div><div className="tl-text">Compras de materiais que ainda não chegaram.</div></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div><div className="tl-day">Dia 12</div><div className="tl-text">Planejamento da loja virtual (nunca lançada).</div></div></div>
              <div className="tl-item"><div className="tl-dot rip"></div><div><div className="tl-day" style={{ color: 'var(--danger)' }}>Dia 18</div><div className="tl-text"><strong>Última atividade detectada. Silêncio eterno.</strong></div></div></div>
            </div>
          </section>

          <section className="bottom-sec">
            <div className="sec-header">
              <div className="sec-title" style={{ fontSize: '14px' }}>Relíquias encontradas</div>
            </div>
            <div className="relics-grid">
              <div className="relic-item"><div className="relic-icon">📄</div><div className="relic-name">Plano de Negócios FINAL_v3_agoraVai.pdf</div></div>
              <div className="relic-item"><div className="relic-icon">📝</div><div className="relic-name">Lista de nomes para a marca</div></div>
              <div className="relic-item"><div className="relic-icon">🏷️</div><div className="relic-name">Rascunho do logo (nunca usado)</div></div>
              <div className="relic-item"><div className="relic-icon">🛒</div><div className="relic-name">Embalagens compradas por impulso</div></div>
            </div>
            <button className="btn-outline" type="button" style={{ width: '100%', marginTop: '12px', fontSize: '12px' }}>Ver todas as relíquias</button>
          </section>

          <section className="bottom-sec">
            <div className="sec-header">
              <div className="sec-title" style={{ fontSize: '14px' }}>Rankings do caos</div>
            </div>
            <div className="rank-tabs">
              {['Geral', 'Por categoria', 'Por causa da morte'].map((tab) => (
                <button
                  key={tab}
                  className={`rank-tab ${activeRankTab === tab ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveRankTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="rank-item"><div className="rank-num">1.</div><div className="rank-avatar">👑</div><div className="rank-info"><div className="rank-name">Rainha dos Começos</div><div className="rank-count">142 ideias abandonadas</div></div></div>
            <div className="rank-item"><div className="rank-num">2.</div><div className="rank-avatar">🐐</div><div className="rank-info"><div className="rank-name">Mestre da Procrastinação</div><div className="rank-count">97 ideias abandonadas</div></div></div>
            <div className="rank-item"><div className="rank-num">3.</div><div className="rank-avatar">⚡</div><div className="rank-info"><div className="rank-name">Deus do Potencial</div><div className="rank-count">73 ideias abandonadas</div></div></div>
            <div className="rank-item"><div className="rank-num">4.</div><div className="rank-avatar">🔮</div><div className="rank-info"><div className="rank-name">Imperador dos "Amanhãs"</div><div className="rank-count">65 ideias abandonadas</div></div></div>
            <div className="rank-item"><div className="rank-num">5.</div><div className="rank-avatar">🧩</div><div className="rank-info"><div className="rank-name">Senhor das Abas Abertas</div><div className="rank-count">61 ideias abandonadas</div></div></div>
            <button className="btn-outline" type="button" style={{ width: '100%', marginTop: '8px', fontSize: '12px' }}>Ver ranking completo</button>
          </section>

          <section className="bottom-sec">
            <div className="sec-header">
              <div className="sec-title" style={{ fontSize: '14px' }}>Conquistas desbloqueadas</div>
            </div>
            <div className="achievement"><div className="ach-medal">🎖</div><div><div className="ach-name">Colecionador de Começos</div><div className="ach-desc">Começou 10 projetos em um ano</div></div></div>
            <div className="achievement"><div className="ach-medal">🛍</div><div><div className="ach-name">Comprou Antes de Fazer</div><div className="ach-desc">Investiu em itens antes de validar a ideia</div></div></div>
            <div className="achievement"><div className="ach-medal">🎴</div><div><div className="ach-name">Especialista em Tutoriais</div><div className="ach-desc">Assistiu 50+ tutoriais e não fez nada</div></div></div>
            <div className="achievement"><div className="ach-medal">🗂️</div><div><div className="ach-name">Mestre do Planejamento</div><div className="ach-desc">Planejou mais do que executou</div></div></div>
            <button className="btn-outline" type="button" style={{ width: '100%', marginTop: '4px', fontSize: '12px' }}>Ver todas conquistas</button>
          </section>

          <section className="bottom-sec">
            <div className="mem-col-title" style={{ marginBottom: '12px' }}>Curadoria diz</div>
            <div className="curator-wrap">
              <div className="curator-face">🎭</div>
              <div>
                <div className="curator-q">"Não é fracasso. É coleção. O museu sempre terá espaço para mais um sonho."</div>
                <div className="curator-sig">- Curadora do Caos</div>
              </div>
            </div>
          </section>
        </div>

        <div className="footer-row">
          <section className="footer-widget">
            <div className="footer-title">🕯️ Homenagear uma ideia</div>
            <div className="footer-sub">Preste sua homenagem a este projeto que partiu cedo demais.</div>
            <div className="candle-row">
              <input className="candle-input" type="text" placeholder="Deixe uma mensagem..." />
              <button className="btn-primary" type="button" style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '8px 14px' }}>Acender velinha</button>
            </div>
          </section>

          <section className="footer-widget">
            <div className="footer-title">📱 Compartilhar memorial</div>
            <div className="footer-sub">Mostre para o mundo o seu potencial desperdiçado.</div>
            <button className="btn-primary" type="button" style={{ fontSize: '12px' }}>📩 Gerar card para compartilhar</button>
          </section>

          <section className="footer-widget">
            <div className="footer-title">💬 Mensagem da curadoria</div>
            <div className="footer-sub">"Não é fracasso. É coleção. O museu sempre terá espaço para mais um sonho."</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>- Curadora do Caos</div>
          </section>

          <section className="footer-widget">
            <div className="footer-title">🔔 Receba alertas do museu</div>
            <div className="footer-sub">Novos achados, relíquias e verdades que você não pediu, mas precisa ouvir.</div>
            <div className="footer-input-row">
              <input className="footer-input" type="email" placeholder="Seu melhor e-mail" />
              <button className="btn-primary" type="button" style={{ fontSize: '12px', padding: '8px 14px' }}>Assinar</button>
            </div>
          </section>
        </div>
      </main>

      {activeModal === 'about' && (
        <MuseumModal
          isOpen={true}
          onClose={closeModal}
          title={MODAL_CONTENTS.about.title}
        >
          {MODAL_CONTENTS.about.content}
        </MuseumModal>
      )}

      {activeModal === 'memorial' && (
        <MuseumModal
          isOpen={true}
          onClose={closeModal}
          title={MODAL_CONTENTS.memorial.title}
        >
          {MODAL_CONTENTS.memorial.content}
        </MuseumModal>
      )}
    </div>
  );
}