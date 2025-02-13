import React from 'react';
import { Image, useMantineColorScheme } from '@mantine/core';

export function SUSSLogo(props: any) {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Image
      src={`https://api.squarers.club/image?name=SUSS${colorScheme === 'dark' ? '' : '_light'}`}
      {...props}
    ></Image>
  );
}
