import PlayersPage from '@/app/[tournament]/players/page';
import { TournamentPageArgs } from '@/app/types';

export default async function UniversalPlayersPage(args: TournamentPageArgs) {
  return PlayersPage(args);
}
