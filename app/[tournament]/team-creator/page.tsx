import { TournamentPageArgs } from '@/app/types';
import { TeamCreatorPage } from '@/components/HandballComponenets/TeamCreatorPage';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function CreateTeamsPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <SidebarLayout tournamentName={tournament}>
      <TeamCreatorPage tournament={tournament} />
    </SidebarLayout>
  );
}
