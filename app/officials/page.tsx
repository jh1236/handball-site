import OfficialsPage from '@/app/[tournament]/officials/page';
import { noTournament } from '@/app/types';

export default async function UniversalOfficialsPage() {
  return OfficialsPage(noTournament);
}
