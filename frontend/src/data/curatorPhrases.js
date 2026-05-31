export const curatorPhrases = [
  {
    id: 'curator-001',
    tone: 'sarcastic',
    text: 'A Curadoria detectou entusiasmo no ambiente. Estamos monitorando.',
  },
  {
    id: 'curator-002',
    tone: 'dramatic',
    text: 'Bem-vinda de volta. Suas promessas antigas sentiram sua falta.',
  },
  {
    id: 'curator-003',
    tone: 'anti-coach',
    text: 'A motivacao passou por aqui mais cedo. Disse que talvez volte segunda-feira.',
  },
  {
    id: 'curator-004',
    tone: 'museum',
    text: 'Este museu nao julga. Apenas arquiva com riqueza de detalhes.',
  },
  {
    id: 'curator-005',
    tone: 'anti-coach',
    text: 'Voce e capaz de tudo. Inclusive de abrir outro projeto antes de terminar este.',
  },
  {
    id: 'curator-006',
    tone: 'sarcastic',
    text: 'Toda grande ideia comeca com coragem, cafe e uma estimativa completamente irrealista.',
  },
  {
    id: 'curator-007',
    tone: 'bureaucratic',
    text: 'A Curadoria acredita no seu potencial. So nao encontrou evidencias recentes.',
  },
  {
    id: 'curator-008',
    tone: 'sarcastic',
    text: 'Nada como comecar um projeto novo para esquecer respeitosamente o anterior.',
  },
  {
    id: 'curator-009',
    tone: 'anti-coach',
    text: 'Planejar tambem conta como fazer, mas so emocionalmente.',
  },
  {
    id: 'curator-010',
    tone: 'bureaucratic',
    text: 'Seu historico indica criatividade elevada e conclusao seletiva.',
  },
  {
    id: 'curator-011',
    tone: 'museum',
    text: 'Algumas reliquias aqui ja foram chamadas de agora vai.',
  },
  {
    id: 'curator-012',
    tone: 'dramatic',
    text: 'A chance de sucesso e incerta. A chance de virar uma boa historia e consideravel.',
  },
  {
    id: 'curator-013',
    tone: 'sarcastic',
    text: 'Hoje e um otimo dia para revisitar uma ideia e abandona-la com mais maturidade.',
  },
  {
    id: 'curator-014',
    tone: 'museum',
    text: 'O museu permanece aberto para ideias que nao resistiram ao primeiro boleto, sprint ou domingo a noite.',
  },
  {
    id: 'curator-015',
    tone: 'bureaucratic',
    text: 'A Curadoria recomenda cautela com qualquer plano criado depois da meia-noite.',
  },
  {
    id: 'curator-016',
    tone: 'anti-coach',
    text: 'Respire fundo. Nem todo insight precisa virar CNPJ, curso ou canal.',
  },
  {
    id: 'curator-017',
    tone: 'dramatic',
    text: 'As vitrines foram limpas. As intencoes, infelizmente, continuam em analise.',
  },
  {
    id: 'curator-018',
    tone: 'sarcastic',
    text: 'A Curadoria viu seu novo plano e abriu uma pasta chamada acompanhamento preventivo.',
  },
  {
    id: 'curator-019',
    tone: 'bureaucratic',
    text: 'Seu pedido de foco foi recebido. A execucao ainda nao protocolou resposta.',
  },
  {
    id: 'curator-020',
    tone: 'museum',
    text: 'Cada aba aberta e uma pequena exposicao sobre excesso de possibilidades.',
  },
  {
    id: 'curator-021',
    tone: 'anti-coach',
    text: 'A produtividade prometeu aparecer hoje, mas pediu para nao confirmar presenca.',
  },
  {
    id: 'curator-022',
    tone: 'sarcastic',
    text: 'A Curadoria nao impede sonhos. Apenas solicita comprovantes de continuidade.',
  },
  {
    id: 'curator-023',
    tone: 'dramatic',
    text: 'Ha beleza em desistir com documentacao adequada.',
  },
  {
    id: 'curator-024',
    tone: 'bureaucratic',
    text: 'A reincidencia criativa foi anotada. Nada grave, apenas profundamente familiar.',
  },
  {
    id: 'curator-025',
    tone: 'sarcastic',
    text: 'Antes de criar outro projeto, a Curadoria sugere encarar os anteriores sem contato visual prolongado.',
  },
  {
    id: 'curator-026',
    tone: 'museum',
    text: 'As ideias repousam em silencio. Algumas ainda seguram um briefing incompleto.',
  },
  {
    id: 'curator-027',
    tone: 'anti-coach',
    text: 'Nao transforme toda epifania em plano trimestral. Algumas so queriam ser anotadas.',
  },
  {
    id: 'curator-028',
    tone: 'dramatic',
    text: 'O museu abriu as portas. As desculpas entraram pela lateral, como de costume.',
  },
  {
    id: 'curator-029',
    tone: 'bureaucratic',
    text: 'O setor de promessas antigas informa que ainda ha pendencias com cheiro de novidade.',
  },
  {
    id: 'curator-030',
    tone: 'sarcastic',
    text: 'A Curadoria aprova sua ambicao, desde que ela nao exija mais uma senha esquecida.',
  },
  {
    id: 'curator-031',
    tone: 'museum',
    text: 'Aqui, ate o potencial desperdicado recebe iluminacao dramatica.',
  },
  {
    id: 'curator-032',
    tone: 'anti-coach',
    text: 'Voce nao precisa monetizar todos os seus surtos de inspiracao. Alguns podem apenas passar.',
  },
];

export function getRandomCuratorPhrase() {
  const index = Math.floor(Math.random() * curatorPhrases.length);
  return curatorPhrases[index];
}
