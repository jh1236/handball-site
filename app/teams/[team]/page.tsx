import IndividualTeamPage from '@/app/[tournament]/teams/[team]/page';
import { TeamPageArgs } from '@/app/types';

export default async function UniversalIndividualTeamPage(args: TeamPageArgs) {
  return IndividualTeamPage(args);
}
