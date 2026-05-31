import 'dotenv/config';
import { getIdeaService } from '../services/IdeaService.js';
import { initialIdeas } from './initialIdeas.js';

const CURATOR_USER_ID = process.env.CURATOR_USER_ID || '00000000-0000-4000-8000-000000000001';

async function main() {
  const ideaService = getIdeaService();
  if (!ideaService.supabase) {
    console.warn(
      'Supabase nao esta disponivel. O seed sera executado apenas em memoria deste processo e nao persistira no banco.',
    );
  }

  const result = await ideaService.seedCuratorIdeas(initialIdeas, {
    userId: CURATOR_USER_ID,
  });

  console.log(
    `Acervo inicial da curadoria: ${result.inserted} inseridas, ${result.skipped} ja existiam.`,
  );

  if (!ideaService.supabase) {
    console.warn(
      'Seed nao persistido. Rode backend/sql/20260531_idea_lifecycle.sql no Supabase e execute npm run seed:ideas novamente.',
    );
  }
}

main().catch((error) => {
  console.error('Nao foi possivel popular o acervo inicial:', error.message);
  process.exit(1);
});
