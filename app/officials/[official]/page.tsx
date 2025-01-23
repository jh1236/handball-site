import IndividualOfficialPage from '@/app/[tournament]/officials/page';
import { OfficialPageArgs } from '@/app/types';

export default async function UniversalIndividualOfficialPage(args: OfficialPageArgs) {
  return IndividualOfficialPage(args);
}
