import TeamsPage from '@/app/[tournament]/teams/page';
import { TournamentPageArgs } from '@/app/types';

export default async function UniversalTeamsPage(args: TournamentPageArgs) {
  return TeamsPage(args);
}
