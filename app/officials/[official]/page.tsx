import IndividualOfficialPage from '@/app/[tournament]/officials/[official]/page';
import { OfficialPageArgs } from '@/app/types';

export default async function UniversalIndividualOfficialPage(args: OfficialPageArgs) {
  return IndividualOfficialPage(args);
}
