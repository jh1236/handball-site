import PlayersPage from '@/app/[tournament]/players/page';
import { noTournament } from '@/app/types';

export default async function UniversalPlayersPage() {
  return PlayersPage(noTournament);
}
