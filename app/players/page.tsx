import PlayersPage from '@/app/[tournament]/players/page';
import { noTournament, TournamentPageArgs } from '@/app/types';

export default async function UniversalPlayersPage() {
  return PlayersPage(noTournament);
}
