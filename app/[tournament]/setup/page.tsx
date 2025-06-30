import { TournamentPageArgs } from '@/app/types';
import { GetTeamCard } from '@/components/HandballComponenets/GetTeamCard';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default async function CreateTeamsPage({ params }: TournamentPageArgs) {
  const { tournament } = await params;
  return (
    <SidebarLayout tournamentName={tournament}>
      <GetTeamCard tournament={tournament!} />
    </SidebarLayout>
  );
}
