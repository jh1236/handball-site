'use client';

import React from 'react';
import { Card, Grid, Group, Image, Text, Title } from '@mantine/core';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

type documentInfo = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

function GenerateDocumentBubble(document: documentInfo) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component="a"
      href={document.link}
      target={document.link !== '#' ? '_blank' : undefined}
    >
      <Card.Section>
        <Image src={document.imageUrl} height={160} alt="Norway" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{document.title}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {document.description}
      </Text>
    </Card>
  );
}

const currentDocuments: documentInfo[] = [
  {
    title: 'Current Rules',
    description: 'The Rules governing a game of S.U.S.S. Handball',
    link: 'https://api.squarers.club/documents/rules',
    imageUrl: 'https://api.squarers.club/image?name=umpire&big=true',
  },
  {
    title: 'Simplified Rules',
    description: 'The most important rules of handball.  Good for new players!',
    link: 'https://api.squarers.club/documents/simplified_rules',
    imageUrl: 'https://api.squarers.club/image?name=SUSS_dark',
  },
  {
    title: 'Code of Conduct',
    description: 'The Code of Conduct that binds all S.U.S.S. players, officials and spectators',
    link: 'https://api.squarers.club/documents/code_of_conduct',
    imageUrl: 'https://api.squarers.club/image?name=SUSS_dark',
  },
  {
    title: 'Tournament Regulations',
    description: 'The Code of Conduct that binds all S.U.S.S. players, officials and spectators',
    link: '#', //https://api.squarers.club/documents/regulations
    imageUrl: 'https://api.squarers.club/image?name=SUSS_dark',
  },
  {
    title: 'The Yellow Book',
    description:
      'A catchall of any unusual decisions that have happened on a handball court, for the sake of keeping precedents',
    link: 'https://docs.google.com/spreadsheets/d/1KwNG112JWU1BIHHj3_LEIhRbPKLNAMla5SdO-SOaotE/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/image?name=yellow_book',
  },
  {
    title: 'The Eighth S.U.S.S. Championship UQP',
    description:
      'The Briefing presented by the S.U.S.S. officiating core covering current interpretations of the rules',
    link: 'https://docs.google.com/presentation/d/1tlqWqJ-WxU8Dl97ELQhfw72ztPIUvP6jwIwdfz9UiaA/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/tournaments/image?name=eighth_suss_championship',
  },
];

const oldDocuments: documentInfo[] = [
  {
    title: 'The Third S.U.S.S. Championship UQP',
    description:
      'The Briefing presented by the S.U.S.S. officiating core covering the interpretations of the rules for the Third S.U.S.S. Championship',
    link: 'https://docs.google.com/presentation/d/1rHmIFjmRfNyh9SzVVY89OGPxwplXc3-R4JXnSIa03Sk/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/tournaments/image?name=third_suss_championship&big=true',
  },
  {
    title: 'The Fourth S.U.S.S. Championship UQP',
    description:
      'The Briefing presented by the S.U.S.S. officiating core covering the interpretations of the rules for the Fourth S.U.S.S. Championship',
    link: 'https://docs.google.com/presentation/d/19f1aP1ucWNLmslApekfMef_Lu1qsh8ckf3zTYA2P-VE/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/tournaments/image?name=fourth_suss_championship&big=true',
  },
  {
    title: 'The Fifth S.U.S.S. Championship UQP',
    description:
      'The Briefing presented by the S.U.S.S. officiating core covering the interpretations of the rules for the Fifth S.U.S.S. Championship',
    link: 'https://docs.google.com/presentation/d/1VkYuVcabr1jVMfTHc7EyL6Q0DGcPTJmXHYd2NUz3pFA/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/tournaments/image?name=fifth_suss_championship&big=true',
  },
  {
    title: 'The Sixth S.U.S.S. Championship UQP',
    description:
      'The Briefing presented by the S.U.S.S. officiating core covering the interpretations of the rules for the Sixth S.U.S.S. Championship',
    link: 'https://docs.google.com/presentation/d/11w2Y5xxK0YuzQu2AhZvCv4zwsjtgIibLtGypKbicdnI/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/tournaments/image?name=sixth_suss_championship&big=true',
  },
  {
    title: 'The Seventh S.U.S.S. Championship UQP',
    description:
      'The Briefing presented by the S.U.S.S. officiating core covering the interpretations of the rules for the Seventh S.U.S.S. Championship',
    link: 'https://docs.google.com/presentation/d/1mxQUzKvw147NF-bWqrQKwa62t20wfL2Ls4f91EYNH1Y/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/tournaments/image?name=seventh_suss_championship&big=true',
  },
];

export default function DocumentPage() {
  return (
    <SidebarLayout>
      <Title>Current Documents</Title>
      <Grid w="98.5%">
        {currentDocuments.map((t) => (
          <Grid.Col
            span={{
              base: 6,
              md: 4,
              lg: 3,
            }}
          >
            {GenerateDocumentBubble(t)}
          </Grid.Col>
        ))}
      </Grid>
      <Title>Archived Documents</Title>
      <Grid w="98.5%">
        {oldDocuments.map((t) => (
          <Grid.Col
            span={{
              base: 6,
              md: 4,
              lg: 3,
            }}
          >
            {GenerateDocumentBubble(t)}
          </Grid.Col>
        ))}
      </Grid>
    </SidebarLayout>
  );
}
