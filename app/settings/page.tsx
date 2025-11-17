'use client';

import { Checkbox, Title } from '@mantine/core';
import { useUserSettings } from '@/components/hooks/userData';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

export default function SettingsPage() {
  const settings = useUserSettings();
  return (
    <SidebarLayout>
      <Title>Settings</Title>
      <i>Settings are stored per device, not per account</i>
      <Checkbox
        m={20}
        label="Use Classic scorer"
        checked={settings.useClassicScorer}
        onChange={() => settings.setUseClassicScorer(!settings.useClassicScorer)}
        description="Enables the old fashioned scoring app"
      ></Checkbox>
    </SidebarLayout>
  );
}
