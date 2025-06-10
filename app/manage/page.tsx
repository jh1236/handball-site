import ManagementPage from '@/app/[tournament]/manage/page';
import { noTournament } from '@/app/types';

export default async function UniversalManagementPage() {
  return ManagementPage(noTournament);
}
