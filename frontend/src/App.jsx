import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MuseumModal from './components/MuseumModal';
import { MODAL_CONTENTS } from './components/ModalContent';
import IdeaForm from './components/IdeaForm';
import FormModal from './components/FormModal';
import RipModal from './components/RipModal';
import AuthScreen from './components/AuthScreen';
import { lightCandle, listIdeas, reviveIdea, subscribeToAlerts } from './services/ideaService';
import { authService } from './services/authService';

const LOCAL_CANDLE_COUNTS_KEY = 'museum_candle_counts';
const LOCAL_REVIVED_STATUS_KEY = 'museum_revived_status';

function readLocalJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeLocalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getIdeaKey(idea) {
  return idea?.id || idea?.name || idea?.nome || '';
}

function normalizeIdeaCard(idea) {
  if (!idea) return null;
  const year = idea.created_at ? new Date(idea.created_at).getFullYear() : new Date().getFullYear();

  return {
    ...idea,
    id: idea.id,
    icon: idea.icon || '🕯️',
    name: idea.name || idea.nome,
    dates: idea.dates || `${year} - ${year}`,
    cause: idea.cause || idea.cause_of_death_summary || idea.motivo || '',
    category: idea.category || idea.categoria || 'Outros',
    status: idea.status || 'abandoned',
    honor_count: Number(idea.honor_count || 0),
  };
}

export default function App() {
  const [authUser, setAuthUser] = useState(() => authService.getStoredUser());
  const [, setAuthSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [activeModal, setActiveModal] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMemTab, setActiveMemTab] = useState('Sobre');
  const [activeRankTab, setActiveRankTab] = useState('Geral');
  const [highlightRankingCard, setHighlightRankingCard] = useState(false);
  const rankData = {
    'Geral': [
      { pos: 1, avatar: '👑', name: 'Rainha dos Começos', count: 142 },
      { pos: 2, avatar: '🐐', name: 'Mestre da Procrastinação', count: 97 },
      { pos: 3, avatar: '⚡', name: 'Deus do Potencial', count: 73 },
      { pos: 4, avatar: '🔮', name: 'Imperador dos "Amanhãs"', count: 65 },
      { pos: 5, avatar: '🧩', name: 'Senhor das Abas Abertas', count: 61 },
    ],
    'Por categoria': [
      { pos: 1, avatar: '💼', name: 'Empreendedorismo', count: 4821 },
      { pos: 2, avatar: '📚', name: 'Estudos', count: 3104 },
      { pos: 3, avatar: '💪', name: 'Fitness', count: 2877 },
      { pos: 4, avatar: '🎨', name: 'Criativas', count: 1943 },
      { pos: 5, avatar: '🗂️', name: 'Organização', count: 1097 },
    ],
    'Por causa da morte': [
      { pos: 1, avatar: '😴', name: 'Procrastinação crônica', count: 3842 },
      { pos: 2, avatar: '💸', name: 'Falta de dinheiro', count: 2761 },
      { pos: 3, avatar: '😩', name: 'Burnout no dia 3', count: 2104 },
      { pos: 4, avatar: '📱', name: 'Distração com redes sociais', count: 1983 },
      { pos: 5, avatar: '🤷', name: 'Simplesmente desistiu', count: 1560 },
    ],
  };
  const [selectedMood] = useState(4);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFeedback, setNewsletterFeedback] = useState(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [selectedCandleIdea, setSelectedCandleIdea] = useState('Loja de Velas Aromáticas');
  const [candleCount, setCandleCount] = useState(() => readLocalJson(LOCAL_CANDLE_COUNTS_KEY, {}));
  const [candleLoading, setCandleLoading] = useState(false);
  const [reviveLoading, setReviveLoading] = useState(false);
  const [isRipModalOpen, setIsRipModalOpen] = useState(false);
  const [ripTargetIdea, setRipTargetIdea] = useState(null);
  const [museumCards, setMuseumCards] = useState([
    { icon: '🧪', name: 'Teste RIP Modal', dates: '2026 – 2026', cause: 'Clique no botão RIP para testar a funcionalidade', category: 'Outros' },
    { icon: '📱', name: 'App de Delivery Gourmet', dates: '2025 – 2025', cause: 'Problema com a integração de pagamento', category: 'Empreendedorismo' },
    { icon: '🎮', name: 'Jogo Indie 2D', dates: '2024 – 2025', cause: 'Sem tempo para terminá-lo', category: 'Criativas' },
    { icon: '💻', name: 'Plataforma SaaS B2B', dates: '2023 – 2024', cause: 'Competência aumentou demais', category: 'Empreendedorismo' },
    { icon: '🌿', name: 'Eco-Startup Sustentável', dates: '2025 – 2025', cause: 'Custos de produção inviáveis', category: 'Empreendedorismo' },
    { icon: '🎓', name: 'Curso Online Premium', dates: '2023 – 2024', cause: 'Gravação de vídeo muito cansativa', category: 'Estudos' },
    { icon: '🏠', name: 'Marketplace Imobiliário', dates: '2024 – 2025', cause: 'Burocracia imobiliária complexa', category: 'Empreendedorismo' },
    { icon: '🍕', name: 'Franquia de Pizza Artesanal', dates: '2023 – 2024', cause: 'Aluguel do ponto muito caro', category: 'Empreendedorismo' },
    { icon: '✈️', name: 'Agência de Viagens Alternativa', dates: '2025 – 2025', cause: 'Pandemia voltou do nada', category: 'Empreendedorismo' },
    { icon: '💄', name: 'Loja de Cosméticos Veganos', dates: '2024 – 2024', cause: 'Concorrência muito forte', category: 'Empreendedorismo' },
    { icon: '📚', name: 'Plataforma de E-books', dates: '2023 – 2024', cause: 'Pirataria é um problema', category: 'Empreendedorismo' },
    { icon: '🕯️', name: 'Loja de Velas Aromáticas', dates: '2022 – 2022', cause: 'Pesquisa excessiva no Pinterest', category: 'Hobbies' },
    { icon: '🎬', name: 'Canal de Produtividade', dates: '2023 – 2023', cause: 'Editou o primeiro vídeo e desistiu', category: 'Hobbies' },
    { icon: '🇩🇪', name: 'Curso de Alemão B1', dates: '2021 – 2021', cause: 'Duolingo burnout', category: 'Estudos' },
    { icon: '💪', name: 'Projeto Fitness', dates: '2022 – 2023', cause: 'Encontrou pão de alho', category: 'Fitness' },
    { icon: '🎙️', name: 'Podcast sobre Mindset', dates: '2023 – 2023', cause: 'Ninguém ouviu o episódio 1', category: 'Hobbies' },
    { icon: '🎨', name: 'Aprender Aquarela', dates: '2022 – 2022', cause: 'Fase existencial', category: 'Criativas' },
    { icon: '🦄', name: 'Startup Inovadora', dates: '2024 – 2024', cause: 'Pitch pro espelho', category: 'Empreendedorismo' },
    { icon: '🐕', name: 'App de Encontros para Cachorros', dates: '2023 – 2023', cause: 'Seu cachorro recusava matches', category: 'Empreendedorismo' },
    { icon: '🥗', name: 'Livro de Receitas Veganas', dates: '2022 – 2023', cause: 'Descobriu que alface é chato', category: 'Criativas' },
    { icon: '🚁', name: 'Curso de Fotografia com Drones', dates: '2024 – 2024', cause: 'Drone caiu na primeira aula', category: 'Estudos' },
    { icon: '☕', name: 'Blog de Reviews de Cafeterias', dates: '2023 – 2023', cause: 'Ficou muito obeso para sair de casa', category: 'Hobbies' },
    { icon: '📋', name: 'App de Gestão de Rotina', dates: '2023 – 2024', cause: 'Muito ocupado planejando pra executar', category: 'Organização' },
    { icon: '🧘', name: 'Desafio de 100 Dias de Meditação', dates: '2024 – 2024', cause: 'Dormiu no dia 5', category: 'Fitness' }
  ]);

  const mainRef = useRef(null);
  const museumSectionRef = useRef(null);
  const memorialSectionRef = useRef(null);
  const reliquiarySectionRef = useRef(null);
  const rankingSectionRef = useRef(null);
  const rankingCardRef = useRef(null);
  const achievementSectionRef = useRef(null);
  const timelineSectionRef = useRef(null);
  const footerRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  const filters = ['Todas', 'Empreendedorismo', 'Estudos', 'Fitness', 'Hobbies', 'Criativas', 'Organização', 'Outros'];
  const survivalPcts = [7, 13, 19, 31, 48];
  const survivalPct = survivalPcts[selectedMood] ?? 13;

  useEffect(() => {
    let mounted = true;

    function getStoredUserWithoutSupabaseSession() {
      const storedUser = authService.getStoredUser();

      if (storedUser?.provider === 'google') {
        authService.clearLocalSession();
        return null;
      }

      return storedUser;
    }

    function applySession(session) {
      const syncedUser = authService.persistSupabaseSession(session);
      if (!mounted) return;

      setAuthSession(session);
      setAuthUser(syncedUser || getStoredUserWithoutSupabaseSession());
      setAuthLoading(false);
    }

    async function syncAuth() {
      const { session, user, error } = await authService.syncSupabaseSession();
      if (!mounted) return;

      if (error) {
        setAuthSession(null);
        setAuthUser(null);
        setAuthLoading(false);
        return;
      }

      setAuthSession(session);
      setAuthUser(user || getStoredUserWithoutSupabaseSession());
      setAuthLoading(false);
    }

    syncAuth();

    const subscription = authService.onSupabaseAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && authService.getStoredUser()?.provider === 'google') {
        authService.clearLocalSession();
      }

      applySession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser) return;

    let active = true;

    async function loadPersistedIdeas() {
      const response = await listIdeas({ status: 'all', limit: 100, offset: 0 });
      if (!active || !response?.data) return;

      const persistedCards = response.data.map(normalizeIdeaCard).filter(Boolean);
      const localStatuses = readLocalJson(LOCAL_REVIVED_STATUS_KEY, {});

      setMuseumCards((currentCards) => {
        const persistedKeys = new Set(persistedCards.map(getIdeaKey));
        const localCards = currentCards
          .filter((card) => !persistedKeys.has(getIdeaKey(card)))
          .map((card) => ({ ...card, status: localStatuses[getIdeaKey(card)] || card.status }));

        return [...persistedCards, ...localCards];
      });

      setCandleCount((currentCounts) => {
        const nextCounts = { ...currentCounts };

        persistedCards.forEach((card) => {
          nextCounts[getIdeaKey(card)] = Number(card.honor_count || 0);
        });

        writeLocalJson(LOCAL_CANDLE_COUNTS_KEY, nextCounts);
        return nextCounts;
      });
    }

    loadPersistedIdeas();

    return () => {
      active = false;
    };
  }, [authUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (highlightRankingCard && !isAutoScrollingRef.current) {
        setHighlightRankingCard(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [highlightRankingCard]);

  const handleNavigate = (section) => {
    setActiveModal(null);

    const scrollToElement = (ref, center = false) => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: center ? 'center' : 'start' });
      }
    };

    const sectionMap = {
      'inicio': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'museu': () => scrollToElement(museumSectionRef),
      'memorial': () => setActiveModal('memorial'),
      'reliquias': () => { setActiveMemTab('Relíquias'); scrollToElement(reliquiarySectionRef); },
      'ranking': () => {
        setHighlightRankingCard(true);
        isAutoScrollingRef.current = true;
        scrollToElement(rankingCardRef, true);
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 800);
      },
      'conquistas': () => { setActiveMemTab('Conquistas'); scrollToElement(achievementSectionRef); },
      'timeline': () => { setActiveMemTab('Linha do Tempo'); scrollToElement(timelineSectionRef); },
      'comunidade': () => scrollToElement(museumSectionRef),
      'sobre': () => setActiveModal('about')
    };

    sectionMap[section]?.();
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsFormModalOpen(false);
  };

  const handleRipClick = (idea) => {
    setRipTargetIdea(idea);
    setIsRipModalOpen(true);
  };

  const handleRipConfirm = async () => {
    if (!ripTargetIdea || reviveLoading) return;

    const targetKey = getIdeaKey(ripTargetIdea);
    setReviveLoading(true);

    try {
      const revivedIdea = ripTargetIdea.id
        ? normalizeIdeaCard(await reviveIdea(ripTargetIdea.id))
        : { ...ripTargetIdea, status: 'reviving' };

      if (!ripTargetIdea.id) {
        const localStatuses = readLocalJson(LOCAL_REVIVED_STATUS_KEY, {});
        writeLocalJson(LOCAL_REVIVED_STATUS_KEY, {
          ...localStatuses,
          [targetKey]: 'reviving',
        });
      }

      setMuseumCards((prev) => prev.map((card) => (
        getIdeaKey(card) === targetKey ? { ...card, ...revivedIdea } : card
      )));
    } finally {
      setReviveLoading(false);
      setRipTargetIdea(null);
    }
  };

  const selectedIdea = museumCards.find(card => (
    getIdeaKey(card) === selectedCandleIdea || card.name === selectedCandleIdea
  )) || museumCards[0];
  const selectedIdeaKey = getIdeaKey(selectedIdea);
  const selectedCandleCount = Number(candleCount[selectedIdeaKey] || selectedIdea?.honor_count || 0);

  const handleLightCandle = async () => {
    if (!selectedIdea || candleLoading) return;

    const selectedKey = getIdeaKey(selectedIdea);
    setCandleLoading(true);

    try {
      if (selectedIdea.id) {
        const updatedIdea = normalizeIdeaCard(await lightCandle(selectedIdea.id));
        const updatedCount = Number(updatedIdea?.honor_count || 0);

        setMuseumCards((prev) => prev.map((card) => (
          getIdeaKey(card) === selectedKey ? { ...card, ...updatedIdea } : card
        )));

        setCandleCount((prev) => {
          const next = { ...prev, [selectedKey]: updatedCount };
          writeLocalJson(LOCAL_CANDLE_COUNTS_KEY, next);
          return next;
        });
      } else {
        setCandleCount((prev) => {
          const next = { ...prev, [selectedKey]: Number(prev[selectedKey] || 0) + 1 };
          writeLocalJson(LOCAL_CANDLE_COUNTS_KEY, next);
          return next;
        });
      }

      setIsVideoModalOpen(true);
    } finally {
      setCandleLoading(false);
    }
  };

  const handleNotificationClick = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShareMemorial = async () => {
    if (!selectedIdea) return;

    const shareData = {
      title: `Memorial de ${selectedIdea.name}`,
      text: `${selectedIdea.name} (${selectedIdea.dates}) - Causa da morte: ${selectedIdea.cause}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      }
    } catch (error) {
      console.error('Nao foi possivel compartilhar o memorial:', error);
    }
  };

  const handleIdeaAdded = (idea) => {
    const card = normalizeIdeaCard(idea);
    if (!card) return;

    const cardKey = getIdeaKey(card);

    setMuseumCards((prev) => {
      const exists = prev.some((item) => getIdeaKey(item) === cardKey);
      return exists
        ? prev.map((item) => (getIdeaKey(item) === cardKey ? { ...item, ...card } : item))
        : [card, ...prev];
    });

    setCandleCount((prev) => {
      const next = { ...prev, [cardKey]: Number(card.honor_count || 0) };
      writeLocalJson(LOCAL_CANDLE_COUNTS_KEY, next);
      return next;
    });

    setSelectedCandleIdea(cardKey);
  };

  const handleNewsletterSubscribe = async () => {
    const email = newsletterEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email || !isValidEmail) {
      setNewsletterFeedback({
        type: 'error',
        message: 'Digite um e-mail válido para assinar os alertas.'
      });
      return;
    }

    try {
      setNewsletterLoading(true);
      setNewsletterFeedback(null);
      await subscribeToAlerts(email);
      setNewsletterFeedback({
        type: 'success',
        message: 'E-mail de confirmacao enviado. Verifique sua caixa de entrada.'
      });
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterFeedback({
        type: 'error',
        message: error.message || 'Nao foi possivel enviar o e-mail de confirmacao.'
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  const validateAuthFields = () => {
    const email = authEmail.trim();

    if (!email) {
      return 'Informe seu e-mail para entrar no museu.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Informe um e-mail valido.';
    }

    if (!authPassword) {
      return 'Informe sua senha.';
    }

    if (authPassword.length < 6) {
      return 'A senha precisa ter pelo menos 6 caracteres.';
    }

    return null;
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateAuthFields();
    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const credentials = {
        email: authEmail.trim(),
        password: authPassword,
        name: authName.trim(),
      };

      const session = authMode === 'signup'
        ? await authService.signupWithPassword(credentials)
        : await authService.loginWithPassword(credentials);

      if (session?.needsEmailConfirmation) {
        setAuthError('Credencial criada. Verifique seu e-mail para confirmar o acesso antes de entrar.');
        return;
      }

      const user = session?.user || authService.getStoredUser();
      if (user) {
        setAuthUser(user);
        return;
      }

      throw new Error('Nao foi possivel iniciar sua sessao. Tente novamente.');
    } catch (error) {
      setAuthError(error.message || 'Nao foi possivel entrar com e-mail e senha.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await authService.loginWithGoogle();
    } catch (error) {
      setAuthError(error.message || 'Nao foi possivel iniciar o login com Google.');
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setAuthUser(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthMode('login');
    setAuthLoading(false);
    setAuthError(null);
  };

  if (!authUser) {
    return (
      <AuthScreen
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authName={authName}
        setAuthName={setAuthName}
        authLoading={authLoading}
        authError={authError}
        onSubmit={handleAuthSubmit}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return (
    <div>
      <Sidebar onNavigate={handleNavigate} />

      <main className="main" ref={mainRef}>
        <header className="topbar">
          <div className="topbar-left">
            Museu das Ideias Abandonadas · Acervo vivo desde 2019
          </div>
          <div className="topbar-right">
            <button className="notif-btn" type="button" aria-label="Notificações" onClick={handleNotificationClick}>
              🔔
              <div className="notif-dot"></div>
            </button>
            <button className="btn-outline" type="button" onClick={handleLogout} style={{ padding: '8px 12px' }}>
              Sair
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
              <button className="btn-primary" type="button" onClick={() => handleNavigate('museu')}>Entrar no Museu ✦</button>
              <button className="btn-outline" type="button" onClick={() => handleNavigate('sobre')}>🎫 Fazer visita guiada</button>
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
            <div className="sec-header" ref={museumSectionRef}>
              <div>
                <div className="sec-title">Dentro do museu</div>
                <div className="sec-sub">Explore as alas do nosso acervo de sonhos não realizados.</div>
              </div>
            </div>

            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar uma ideia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              {museumCards
                .filter(card => {
                  const matchesCategory = activeFilter === 'Todas' || card.category === activeFilter;
                  const matchesSearch = searchQuery === '' || card.name.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesCategory && matchesSearch;
                })
                .map((card) => {
                  const cardKey = getIdeaKey(card);
                  const cardCandleCount = Number(candleCount[cardKey] || card.honor_count || 0);

                  return (
                <div className="idea-card" key={cardKey} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setSelectedCandleIdea(cardKey); memorialSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                  {cardCandleCount > 0 && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                      {cardCandleCount > 1 && (
                        <div style={{ background: 'var(--danger)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginBottom: '-8px' }}>
                          {cardCandleCount}
                        </div>
                      )}
                      <div style={{ fontSize: '20px', filter: 'drop-shadow(0 0 4px rgba(255, 100, 100, 0.6))' }}>🕯️</div>
                    </div>
                  )}
                  <div
                    className="idea-thumb"
                    style={{
                      background:
                        card.name === 'Teste RIP Modal'
                          ? 'linear-gradient(135deg, #2a1f3a, #3d2a4d)'
                          : card.name === 'App de Delivery Gourmet'
                            ? 'linear-gradient(135deg, #2a2a1a, #3d3820)'
                            : card.name === 'Jogo Indie 2D'
                              ? 'linear-gradient(135deg, #1a2a2a, #203535)'
                              : card.name === 'Plataforma SaaS B2B'
                                ? 'linear-gradient(135deg, #2a1a2a, #3d2040)'
                                : card.name === 'Eco-Startup Sustentável'
                                  ? 'linear-gradient(135deg, #1a2a1a, #203525)'
                                  : card.name === 'Curso Online Premium'
                                    ? 'linear-gradient(135deg, #2a1a3a, #3d2050)'
                                    : card.name === 'Marketplace Imobiliário'
                                      ? 'linear-gradient(135deg, #2a2a1f, #3d3d2a)'
                                      : card.name === 'Franquia de Pizza Artesanal'
                                        ? 'linear-gradient(135deg, #2a1f1a, #3d2820)'
                                        : card.name === 'Agência de Viagens Alternativa'
                                          ? 'linear-gradient(135deg, #1a2a3a, #203550)'
                                          : card.name === 'Loja de Cosméticos Veganos'
                                            ? 'linear-gradient(135deg, #2a1a3a, #3d2850)'
                                            : card.name === 'Plataforma de E-books'
                                              ? 'linear-gradient(135deg, #1a1a2a, #252550)'
                                              : card.name === 'Loja de Velas Aromáticas'
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
                    <button
                      type="button"
                      className="idea-rip"
                      disabled={card.status === 'reviving' || reviveLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRipClick(card);
                      }}
                    >
                      🪦 RIP
                    </button>
                  </div>
                  <div className="idea-body">
                    <div className="idea-name">{card.name}</div>
                    <div className="idea-dates">{card.dates}</div>
                    <div className="idea-cause">
                      <strong>Causa da morte:</strong> {card.cause}
                    </div>
                  </div>
                </div>
                  );
                })}

            </div>
          </div>

          <div className="right-col">
            <div className="form-card">
              <div className="form-title">Adicionar nova tragédia</div>
              <div className="form-sub">Registre sua ideia para que ela seja eternizada.</div>
              <button
                className="btn-submit"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsFormModalOpen(true);
                }}
              >
                ✉ Abrir formulário
              </button>
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

            <div className="curator-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Curadoria diz</div>
              <div className="curator-wrap">
                <div className="curator-face">🎭</div>
                <div>
                  <div className="curator-q">"Não é fracasso. É coleção. O museu sempre terá espaço para mais um sonho."</div>
                  <div className="curator-sig">- Curadora do Caos</div>
                </div>
              </div>
            </div>

            <div ref={rankingCardRef} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px', marginBottom: '20px', boxShadow: highlightRankingCard ? '0 0 30px rgba(155, 127, 244, 0.8), 0 0 60px rgba(155, 127, 244, 0.4)' : 'none', transition: 'box-shadow 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div className="sec-title rank-glitch-title" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }} data-text="Rankings do caos">Rankings do caos</div>
                <div className="rank-live-badge"><span className="rank-live-dot"></span>AO VIVO</div>
              </div>
              <div className="rank-tabs">
                {['Geral', 'Por categoria', 'Por causa da morte'].map((tab) => (
                  <button key={tab} className={`rank-tab ${activeRankTab === tab ? 'active' : ''}`} type="button" onClick={() => setActiveRankTab(tab)}>{tab}</button>
                ))}
              </div>
              {(() => {
                const items = rankData[activeRankTab];
                const top3 = items.slice(0, 3);
                const rest = items.slice(3);
                const maxCount = items[0].count;
                const podiumOrder = [top3[1], top3[0], top3[2]];
                const podiumHeights = [70, 90, 55];
                const podiumColors = ['#a0a8b8', '#e8b86d', '#c87941'];
                const podiumLabels = ['2º', '1º', '3º'];
                return (
                  <>
                    <div className="rank-podium">
                      {podiumOrder.map((item, i) => (
                        <div key={item.name} className="rank-podium-item" style={{ '--podium-height': `${podiumHeights[i]}px`, '--podium-color': podiumColors[i] }}>
                          <div className="rank-podium-avatar">{item.avatar}</div>
                          <div className="rank-podium-name">{item.name}</div>
                          <div className="rank-podium-count">{item.count.toLocaleString()}</div>
                          <div className="rank-podium-base">
                            <span className="rank-podium-pos" style={{ color: podiumColors[i] }}>{podiumLabels[i]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {rest.map((item) => (
                      <div key={item.name} className="rank-item rank-item-bar">
                        <div className="rank-num">{item.pos}.</div>
                        <div className="rank-avatar">{item.avatar}</div>
                        <div className="rank-info">
                          <div className="rank-name">{item.name}</div>
                          <div className="rank-bar">
                            <div className="rank-bar-fill" style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
                          </div>
                        </div>
                        <div className="rank-count" style={{ whiteSpace: 'nowrap', fontSize: '10px' }}>{item.count.toLocaleString()}</div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
          <div className="sec-header" ref={memorialSectionRef}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="sec-title">Memorial de uma ideia</div>
              {selectedCandleCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(224, 96, 96, 0.2)', padding: '6px 12px', borderRadius: '20px' }}>
                  <div style={{ fontSize: '16px' }}>🕯️</div>
                  {selectedCandleCount > 1 && (
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--danger)' }}>{selectedCandleCount}</div>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleRipClick(selectedIdea)}
                disabled={selectedIdea?.status === 'reviving' || reviveLoading}
                style={{
                  background: 'linear-gradient(135deg, #ff6060, #ff4444)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 96, 96, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                🪦 RIP
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', position: 'relative' }}>
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
                {selectedIdea.icon}
              </div>
              <div>
                <div className="memorial-name">{selectedIdea.name}</div>
                <div className="memorial-dates">{selectedIdea.dates}</div>
                <div className="memorial-cause-label">Causa da morte</div>
                <div className="memorial-cause-val">{selectedIdea.cause}</div>
                <div className="memorial-quote">"Só mais uma ideia que poderia ter mudado tudo."</div>
              </div>
            </div>

            <div className="memorial-tabs">
              {['Sobre', 'Linha do Tempo', 'Relíquias', 'Conquistas'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`mem-tab ${activeMemTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveMemTab(tab);
                    if (window.innerWidth < 768) {
                      setTimeout(() => {
                        const tabRefMap = {
                          'Sobre': memorialSectionRef,
                          'Linha do Tempo': timelineSectionRef,
                          'Relíquias': reliquiarySectionRef,
                          'Conquistas': achievementSectionRef
                        };
                        tabRefMap[tab].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="memorial-cols" style={{ background: activeMemTab === 'Sobre' ? 'var(--bg3)' : 'transparent', padding: activeMemTab === 'Sobre' ? '12px' : '0', margin: activeMemTab === 'Sobre' ? '8px' : '0', borderRadius: activeMemTab === 'Sobre' ? 'var(--radius-sm)' : '0', boxShadow: activeMemTab === 'Sobre' ? '0 0 20px rgba(155, 127, 244, 0.6), 0 0 40px rgba(155, 127, 244, 0.3)' : 'none', transition: 'all 0.2s' }}>
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

        <div className="bottom-grid">
          <section className="bottom-sec" ref={timelineSectionRef} style={{ background: activeMemTab === 'Linha do Tempo' ? 'var(--bg3)' : 'transparent', padding: activeMemTab === 'Linha do Tempo' ? '12px' : '20px', margin: activeMemTab === 'Linha do Tempo' ? '8px' : '0', borderRadius: activeMemTab === 'Linha do Tempo' ? 'var(--radius-sm)' : '0', boxShadow: activeMemTab === 'Linha do Tempo' ? '0 0 20px rgba(155, 127, 244, 0.6), 0 0 40px rgba(155, 127, 244, 0.3)' : 'none', transition: 'all 0.2s' }}>
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

          <section className="bottom-sec" ref={reliquiarySectionRef} style={{ background: activeMemTab === 'Relíquias' ? 'var(--bg3)' : 'transparent', padding: activeMemTab === 'Relíquias' ? '12px' : '20px', margin: activeMemTab === 'Relíquias' ? '8px' : '0', borderRadius: activeMemTab === 'Relíquias' ? 'var(--radius-sm)' : '0', boxShadow: activeMemTab === 'Relíquias' ? '0 0 20px rgba(155, 127, 244, 0.6), 0 0 40px rgba(155, 127, 244, 0.3)' : 'none', transition: 'all 0.2s' }}>
            <div className="sec-header">
              <div className="sec-title" style={{ fontSize: '14px' }}>Relíquias encontradas</div>
            </div>
            <div className="relics-grid">
              <div className="relic-item"><div className="relic-icon">📄</div><div className="relic-name">Plano de Negócios FINAL_v3_agoraVai.pdf</div></div>
              <div className="relic-item"><div className="relic-icon">📝</div><div className="relic-name">Lista de nomes para a marca</div></div>
              <div className="relic-item"><div className="relic-icon">🏷️</div><div className="relic-name">Rascunho do logo (nunca usado)</div></div>
              <div className="relic-item"><div className="relic-icon">🛒</div><div className="relic-name">Embalagens compradas por impulso</div></div>
            </div>
          </section>

          <section className="bottom-sec" ref={rankingSectionRef} style={{ display: 'none' }} />

          <section className="bottom-sec" ref={achievementSectionRef} style={{ background: activeMemTab === 'Conquistas' ? 'var(--bg3)' : 'transparent', padding: activeMemTab === 'Conquistas' ? '12px' : '20px', margin: activeMemTab === 'Conquistas' ? '8px' : '0', borderRadius: activeMemTab === 'Conquistas' ? 'var(--radius-sm)' : '0', boxShadow: activeMemTab === 'Conquistas' ? '0 0 20px rgba(155, 127, 244, 0.6), 0 0 40px rgba(155, 127, 244, 0.3)' : 'none', transition: 'all 0.2s' }}>
            <div className="sec-header">
              <div className="sec-title" style={{ fontSize: '14px' }}>Conquistas desbloqueadas</div>
            </div>
            <div className="achievement"><div className="ach-medal">🎖</div><div><div className="ach-name">Colecionador de Começos</div><div className="ach-desc">Começou 10 projetos em um ano</div></div></div>
            <div className="achievement"><div className="ach-medal">🛍</div><div><div className="ach-name">Comprou Antes de Fazer</div><div className="ach-desc">Investiu em itens antes de validar a ideia</div></div></div>
            <div className="achievement"><div className="ach-medal">🎴</div><div><div className="ach-name">Especialista em Tutoriais</div><div className="ach-desc">Assistiu 50+ tutoriais e não fez nada</div></div></div>
            <div className="achievement"><div className="ach-medal">🗂️</div><div><div className="ach-name">Mestre do Planejamento</div><div className="ach-desc">Planejou mais do que executou</div></div></div>
          </section>

        </div>

        <div className="footer-row" ref={footerRef}>
          <section className="footer-widget">
            <div className="footer-title">🕯️ Homenagear uma ideia</div>
            <div className="footer-sub">Preste sua homenagem a este projeto que partiu cedo demais.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <select
                value={selectedCandleIdea}
                onChange={(e) => setSelectedCandleIdea(e.target.value)}
                className="form-select"
                style={{ marginBottom: '0' }}
              >
                {museumCards.map((card) => (
                  <option key={getIdeaKey(card)} value={getIdeaKey(card)}>
                    {card.icon} {card.name}
                  </option>
                ))}
              </select>
              <button className="btn-primary" type="button" style={{ width: '100%', fontSize: '12px', padding: '8px 14px' }} onClick={handleLightCandle} disabled={candleLoading}>Acender velinha</button>
            </div>
          </section>

          <section className="footer-widget">
            <div className="footer-title">📱 Compartilhar memorial</div>
            <div className="footer-sub">Mostre para o mundo o seu potencial desperdiçado.</div>
            <button className="btn-primary" type="button" style={{ fontSize: '12px' }} onClick={handleShareMemorial}>📩 Gerar card para compartilhar</button>
          </section>

          <section className="footer-widget">
            <div className="footer-title">🔔 Receba alertas do museu</div>
            <div className="footer-sub">Novos achados, relíquias e verdades que você não pediu, mas precisa ouvir.</div>
            <div className="footer-input-row">
              <input
                className="footer-input"
                type="email"
                placeholder="Seu melhor e-mail"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  if (newsletterFeedback) {
                    setNewsletterFeedback(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleNewsletterSubscribe();
                  }
                }}
                disabled={newsletterLoading}
              />
              <button
                className="btn-primary"
                type="button"
                onClick={handleNewsletterSubscribe}
                disabled={newsletterLoading}
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                {newsletterLoading ? 'Enviando...' : 'Assinar'}
              </button>
            </div>
            {newsletterFeedback && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  color: newsletterFeedback.type === 'success' ? '#7fd6a9' : 'var(--danger)'
                }}
              >
                {newsletterFeedback.message}
              </div>
            )}
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

      <FormModal isOpen={isFormModalOpen} onClose={closeModal}>
        <IdeaForm onIdeaAdded={handleIdeaAdded} />
      </FormModal>

      {isVideoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>🕯️ Homenagem a {selectedCandleIdea}</div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text2)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsVideoModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
              <video
                width="100%"
                height="500"
                controls
                autoPlay
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                <source src="/src/images/Firefly A memorial candle slowly burning in a luxury dark museum. The golden flame flickers naturall.mp4" type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
            </div>
          </div>
        </div>
      )}

      <RipModal
        isOpen={isRipModalOpen}
        onClose={() => setIsRipModalOpen(false)}
        idea={ripTargetIdea}
        onConfirm={handleRipConfirm}
      />

    </div>
  );
}
