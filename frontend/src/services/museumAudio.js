const CUES = {
  hover: { frequencies: [260, 390], duration: 0.08, gain: 0.018, type: 'sine' },
  modal: { frequencies: [120, 185, 246], duration: 0.38, gain: 0.025, type: 'sine' },
  honor: { frequencies: [392, 523, 784], duration: 0.5, gain: 0.024, type: 'triangle' },
  share: { frequencies: [220, 330, 440], duration: 0.32, gain: 0.022, type: 'sine' },
  revive: { frequencies: [96, 144, 220, 330], duration: 0.62, gain: 0.025, type: 'sawtooth' },
};

let audioContext;
let masterGain;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!audioContext) {
    audioContext = new AudioCtor();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

export function playMuseumCue(cueName = 'hover') {
  const cue = CUES[cueName] || CUES.hover;
  const context = getAudioContext();
  if (!context || !masterGain) return;

  const now = context.currentTime;
  const output = context.createGain();
  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(cue.gain, now + 0.03);
  output.gain.exponentialRampToValueAtTime(0.0001, now + cue.duration);
  output.connect(masterGain);

  cue.frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = cue.type;
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.035);
    oscillator.detune.setValueAtTime(index * -4, now);
    oscillator.connect(output);
    oscillator.start(now + index * 0.035);
    oscillator.stop(now + cue.duration + 0.04);
  });
}

export function createCuratorNarration(idea = {}) {
  const name = idea.name || idea.nome || 'esta ideia';
  const cause = idea.cause || idea.motivo || 'circunstancias administrativas nao esclarecidas';
  const category = idea.category || idea.categoria || 'projeto';

  const lines = {
    Startup: `Aqui repousa ${name}, uma startup que prometia revolucionar o mercado. Nao sobreviveu ao contato com a primeira planilha.`,
    Estudos: `Esta vitrine preserva ${name}, um estudo nobre, interrompido quando a motivacao encontrou a vida adulta no corredor.`,
    Fitness: `${name} entrou no acervo apos um breve periodo de disciplina e uma longa negociacao com o sofa.`,
    Hobbies: `${name} viveu intensamente durante algumas tardes e permaneceu em planejamento por tempo suficiente para virar patrimonio.`,
  };

  return lines[category] || `Segundo a Curadoria, ${name} foi arquivada por ${cause}. Um caso classico de entusiasmo agudo seguido de fadiga administrativa.`;
}

export function narrateCuratorText(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
    playMuseumCue('share');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.88;
  utterance.pitch = 0.78;
  utterance.volume = 0.82;
  window.speechSynthesis.speak(utterance);
}
