import OfficialsPage from '@/app/[tournament]/officials/[official]/page';
import { TournamentPageArgs } from '@/app/[tournament]/types';

export default async function UniversalOfficialsPage(args: TournamentPageArgs) {
  return OfficialsPage(args);
}
