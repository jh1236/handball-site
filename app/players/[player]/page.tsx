import IndividualPlayerPage from '@/app/[tournament]/players/[player]/page';
import { PlayerPageArgs } from '@/app/types';

export default async function UniversalIndividualPlayerPage(args: PlayerPageArgs) {
  return IndividualPlayerPage(args);
}
