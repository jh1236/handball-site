import React from 'react';
import { TournamentPageArgs } from '@/app/types';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import BestDressedPage from "@/components/HandballComponenets/BestDressedPage";

export default async function bestDressedPage({ params }: TournamentPageArgs) {
    const { tournament } = await params;
    return (
        <>
            <SidebarLayout tournamentName={tournament}>
                <BestDressedPage tournamentName={tournament}></BestDressedPage>
            </SidebarLayout>
        </>
    );
}
