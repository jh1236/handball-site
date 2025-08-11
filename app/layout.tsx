import '@mantine/core/styles.css';
import './global.css';

import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import { theme } from '@/theme';

export const metadata = {
  title: 'Squarers United Sporting',
  description: 'The competitive sporting league we all love.',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
    <head>
      <link rel="manifest" href="/manifest.webmanifest" />
      <ColorSchemeScript />
      <link rel="shortcut icon" href={`${SERVER_ADDRESS}/api/image?name=SUSS`} />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
      />
    </head>
    <body>
    <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
