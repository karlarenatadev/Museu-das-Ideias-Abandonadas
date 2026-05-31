const modalStyles = `
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

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-section {
    animation: slideInUp 0.5s ease-out forwards;
  }

  .modal-section:nth-child(1) { animation-delay: 0.1s; }
  .modal-section:nth-child(2) { animation-delay: 0.2s; }
  .modal-section:nth-child(3) { animation-delay: 0.3s; }
  .modal-section:nth-child(4) { animation-delay: 0.4s; }

  .modal-card {
    background: linear-gradient(135deg, rgba(22, 16, 32, 0.5), rgba(30, 22, 48, 0.3));
    border: 1px solid rgba(180, 140, 255, 0.2);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .modal-card:hover {
    background: linear-gradient(135deg, rgba(22, 16, 32, 0.8), rgba(30, 22, 48, 0.6));
    border-color: rgba(180, 140, 255, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(155, 127, 244, 0.15);
  }

  .modal-card-title {
    color: #c4a8ff;
    font-weight: 700;
    margin-bottom: 12px;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .modal-card-text {
    color: #a898c8;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }

  .modal-team-member {
    background: rgba(22, 16, 32, 0.4);
    border-left: 3px solid rgba(232, 184, 109, 0.3);
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .modal-team-member:hover {
    background: rgba(22, 16, 32, 0.7);
    border-left-color: rgba(232, 184, 109, 0.8);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(155, 127, 244, 0.1);
  }

  .modal-team-name {
    font-weight: 700;
    color: #e8e0f5;
    font-size: 15px;
    margin-bottom: 4px;
  }

  .modal-team-role {
    color: #c4a8ff;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .modal-team-desc {
    color: #a898c8;
    font-size: 12px;
    font-style: italic;
    margin: 0;
  }

  .modal-quote-box {
    background: linear-gradient(135deg, rgba(155, 127, 244, 0.1), rgba(232, 184, 109, 0.05));
    border-left: 4px solid rgba(232, 184, 109, 0.4);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
  }

  .modal-quote-text {
    color: #c4a8ff;
    font-style: italic;
    font-size: 15px;
    line-height: 1.6;
    margin: 0 0 12px 0;
  }

  .modal-quote-author {
    color: #6a5c8a;
    font-size: 12px;
    font-weight: 600;
    margin: 0;
  }
`;

export const MODAL_CONTENTS = {
  about: {
    title: 'Sobre o Museu',
    content: (
      <>
        <style>{modalStyles}</style>
        <div className="modal-section" style={{ animation: 'slideInUp 0.5s ease-out' }}>
          <p style={{ color: '#a898c8', fontSize: '15px', lineHeight: '1.7', marginBottom: '20px' }}>
            Bem-vindo ao <strong style={{ color: '#c4a8ff' }}>Museu das Ideias Abandonadas</strong>, o único espaço dedicado à preservação, estudo e contemplação de projetos que tinham tudo para dar certo... até deixarem de ter.
          </p>

          <p style={{ color: '#a898c8', fontSize: '15px', lineHeight: '1.7', marginBottom: '20px' }}>
            Aqui repousam startups revolucionárias, aplicativos geniais, canais promissores, cursos comprados com entusiasmo excessivo e planos que morreram logo após a fase do "agora vai".
          </p>
        </div>

        <div className="modal-quote-box">
          <p className="modal-quote-text">
            <strong>Nossa Missão:</strong> preservar sonhos interrompidos, documentar fracassos criativos e promover o avanço sistemático da procrastinação aplicada.
          </p>
          <p className="modal-quote-text" style={{ fontSize: '14px' }}>
            ✨ Porque toda ideia merece uma chance... de ser abandonada!
          </p>
        </div>

        <div className="modal-section" style={{ animation: 'slideInUp 0.6s ease-out', animationFillMode: 'both' }}>
          <p style={{ color: '#a898c8', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
            Utilizando inteligência artificial, sarcasmo acadêmico e uma metodologia altamente questionável, nossa <strong style={{ color: '#c4a8ff' }}>Curadoria do Caos</strong> investiga cada projeto, identifica sua causa oficial de morte e garante que aquela ideia jamais volte para assombrar sua lista de objetivos.
          </p>

          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#c4a8ff', fontSize: '14px', marginBottom: '28px' }}>
            Museu das Ideias Abandonadas — ajudando grandes ideias a não saírem do papel desde 2026.
          </p>
        </div>

        <div className="modal-section" style={{ animation: 'slideInUp 0.7s ease-out', animationFillMode: 'both' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(22, 16, 32, 0.6), rgba(30, 22, 48, 0.4))',
            border: '1px solid rgba(180, 140, 255, 0.2)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '16px'
          }}>
            <h3 style={{
              color: '#c4a8ff',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              🏛️ Conselho Supremo das Ideias Abandonadas
            </h3>

            <p style={{ color: '#6a5c8a', fontSize: '13px', fontStyle: 'italic', marginBottom: '20px', margin: '12px 0 20px 0' }}>
              Quem deveria ter impedido isso... mas preferiu documentar.
            </p>

            <div>
              {[
                {
                  emoji: '🎤',
                  name: 'Pamela · Nível 99',
                  role: 'Visionária do Caos Criativo',
                  title: 'Diretora de Sonhos Não Realizados',
                  desc: '✨ Transformar delírios de madrugada em funcionalidades oficialmente questionáveis.'
                },
                {
                  emoji: '💻',
                  name: 'Adriana · Nível 99',
                  role: 'Conjuradora de Interfaces',
                  title: 'Diretora de Materialização Digital',
                  desc: '✨ Converter caos conceitual em telas clicáveis e perigosamente bonitas.'
                },
                {
                  emoji: '⚙️',
                  name: 'Carla · Nível 99',
                  role: 'Alquimista de Sistemas',
                  title: 'Diretora de Engenharia das Gambiarras Nobres',
                  desc: '✨ Convencer APIs e integrações a cooperarem contra todas as probabilidades.'
                },
                {
                  emoji: '🚀',
                  name: 'Lua · Nível 99',
                  role: 'Exploradora de Possibilidades',
                  title: 'Diretora de Pesquisas Altamente Questionáveis',
                  desc: '✨ Transformar ideias improváveis em protótipos funcionais.'
                }
              ].map((member, idx) => (
                <div key={idx} className="modal-team-member" style={{ animationDelay: `${0.8 + idx * 0.1}s` }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '24px', minWidth: '32px', display: 'flex', alignItems: 'center' }}>{member.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div className="modal-team-name">{member.name}</div>
                      <div style={{ color: '#a898c8', fontSize: '13px', marginBottom: '4px' }}>{member.role}</div>
                      <div className="modal-team-role">{member.title}</div>
                      <div className="modal-team-desc">{member.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{
          fontSize: '12px',
          color: '#6a5c8a',
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: '24px'
        }}>
          Fundado em 2026 · Porque toda desistência merece um memorial
        </p>
      </>
    )
  },

  memorial: {
    title: 'Memorial das Ideias',
    content: (
      <>
        <style>{modalStyles}</style>
        <div className="modal-section" style={{ animation: 'slideInUp 0.5s ease-out' }}>
          <p style={{ color: '#a898c8', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
            Este é o <strong style={{ color: '#c4a8ff' }}>memorial sagrado</strong> onde cada ideia abandonada encontra seu lugar na história.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                emoji: '💀',
                title: 'Ideias Catalogadas',
                desc: 'Mais de 1.247 ideias já passaram pela análise da Curadora do Caos, cada uma com sua própria história de fracasso e aprendizado.'
              },
              {
                emoji: '🎭',
                title: 'Categorias',
                desc: 'Apps, Startups, Projetos Pessoais, SaaS, E-commerce, Jogos, Blogs e muito mais. Cada categoria tem seu próprio espaço no museu.'
              },
              {
                emoji: '🔮',
                title: 'Análise por IA',
                desc: 'Cada ideia recebe uma análise profunda: porcentagem de sobrevivência, causa da morte e um veredito sarcástico mas reconfortante.'
              }
            ].map((card, idx) => (
              <div key={idx} className="modal-card" style={{ animationDelay: `${0.6 + idx * 0.15}s`, animationFillMode: 'both' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px', minWidth: '24px' }}>{card.emoji}</span>
                  <div>
                    <div className="modal-card-title" style={{ fontSize: '15px' }}>{card.title}</div>
                    <p className="modal-card-text">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-quote-box" style={{ animation: 'slideInUp 0.8s ease-out', animationFillMode: 'both' }}>
          <p className="modal-quote-text">
            "Todo fracasso é um passo em direção ao sucesso"
          </p>
          <p className="modal-quote-author">— Curadora do Caos</p>
        </div>
      </>
    )
  }
};
