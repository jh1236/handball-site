import TeamsPage from '@/app/[tournament]/teams/page';
import { noTournament } from '@/app/types';

export default async function UniversalTeamsPage() {
  return TeamsPage(noTournament);
}
