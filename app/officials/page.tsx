import IndividualOfficialPage from '@/app/[tournament]/officials/page';
import { TournamentPageArgs } from '@/app/[tournament]/types';

export default async function UniversalIndividualOfficialPage(args: TournamentPageArgs) {
  return IndividualOfficialPage(args);
}
