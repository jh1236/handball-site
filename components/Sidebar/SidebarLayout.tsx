'use client';

import '@mantine/core/styles.css';

import React from 'react';
import { NavbarNested } from '@/components/Sidebar/NavbarNested';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function SidebarLayout({ children }: { children: any }) {
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
  return (
    <div>
      <NavbarNested sidebar={sidebarVisible} setSidebar={setSidebarVisible}></NavbarNested>
      <div
        style={{
          overflowY: 'scroll',
          height: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
}
