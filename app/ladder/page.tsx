import LadderPage from '@/app/[tournament]/ladder/page';
import { noTournament } from '@/app/types';

export default async function UniversalLadderPage() {
  return LadderPage(noTournament);
}
