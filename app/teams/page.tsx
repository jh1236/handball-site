import TeamsPage from '@/app/[tournament]/teams/page';
import { TournamentPageArgs } from '@/app/[tournament]/types';

export default async function UniversalTeamsPage(args: TournamentPageArgs) {
  return TeamsPage(args);
}
