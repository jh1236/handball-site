'use client';

import React from 'react';
import Ladder from '@/components/HandballComponenets/StatsComponents/Ladder';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default function HomePage() {
  return (
    <>
      <SidebarLayout>
        <h1>Ladder asf</h1>
        <div>
          <br></br>
          <Ladder></Ladder>
        </div>
      </SidebarLayout>
    </>
  );
}
