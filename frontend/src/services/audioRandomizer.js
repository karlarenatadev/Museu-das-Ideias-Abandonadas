const audioModules = import.meta.glob('../audios/**/*.mp3', { eager: true });

export function playRandomAudio(folderName) {
  const folderKey = folderName.toLowerCase().trim();

  const audioFilesInFolder = Object.entries(audioModules)
    .filter(([key]) => {
      const keyLower = key.toLowerCase();
      return keyLower.includes(`/audios/${folderKey}/`);
    })
    .map(([_, module]) => module.default);

  if (audioFilesInFolder.length === 0) {
    console.error(`❌ Sem áudios para: ${folderName}`);
    return null;
  }

  const randomIndex = Math.floor(Math.random() * audioFilesInFolder.length);
  const audioUrl = audioFilesInFolder[randomIndex];

  console.log(`🎵 Tocando...`);

  const audio = new Audio(audioUrl);
  audio.volume = 1;
  audio.play().catch(e => console.error(`❌ Erro:`, e));

  return audio;
}
