import LadderPage from '@/app/[tournament]/ladder/page';
import { TournamentPageArgs } from '@/app/[tournament]/types';

export default async function UniversalLadderPage(args: TournamentPageArgs) {
  return LadderPage(args);
}
