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
        <Image src={document.imageUrl} height="100%" alt={document.title} />
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
    description: 'The Rules governing a game of SUSS Handball',
    link: 'https://api.squarers.club/api/documents/rules',
    imageUrl: 'https://api.squarers.club/api/image?name=umpire&big=true',
  },
  {
    title: 'Simplified Rules',
    description: 'The most important rules of handball.  Good for new players!',
    link: 'https://api.squarers.club/api/documents/simplified_rules',
    imageUrl: 'https://api.squarers.club/api/image?name=SUSS_dark',
  },
  {
    title: 'Code of Conduct',
    description: 'The Code of Conduct that binds all SUSS players, officials and spectators',
    link: 'https://api.squarers.club/api/documents/code_of_conduct',
    imageUrl: 'https://api.squarers.club/api/image?name=SUSS_dark',
  },
  {
    title: 'Tournament Regulations',
    description: 'The Code of Conduct that binds all SUSS players, officials and spectators',
    link: 'https://api.squarers.club/api/documents/tournament_regulations',
    imageUrl: 'https://api.squarers.club/api/image?name=SUSS_dark',
  },
  {
    title: 'The Yellow Book',
    description:
      'A catchall of any unusual decisions that have happened on a handball court, for the sake of keeping precedents',
    link: 'https://docs.google.com/spreadsheets/d/1KwNG112JWU1BIHHj3_LEIhRbPKLNAMla5SdO-SOaotE/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/api/image?name=yellow_book',
  },
  {
    title: 'The Tenth SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering current interpretations of the rules',
    link: 'https://docs.google.com/presentation/d/1-7KIau6Z-DeVF4w-2KlD3gMMei4VNTYQTjvuQbyEUnI/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/api/tournaments/image?name=tenth_suss_championship',
  },
];

const oldDocuments: documentInfo[] = [
  {
    title: 'The Ninth SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering current interpretations of the rules for the Ninth SUSS Championship',
    link: 'https://docs.google.com/presentation/d/17KdW7FA45ytAue-eKcvOF_azktaFWCBbqt4pRTzk7T8/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/api/tournaments/image?name=ninth_suss_championship',
  },
  {
    title: 'The Eighth SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering the interpretations of the rules for the Eighth SUSS Championship',
    link: 'https://docs.google.com/presentation/d/1tlqWqJ-WxU8Dl97ELQhfw72ztPIUvP6jwIwdfz9UiaA/edit?usp=sharing',
    imageUrl: 'https://api.squarers.club/api/tournaments/image?name=eighth_suss_championship',
  },
  {
    title: 'The Seventh SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering the interpretations of the rules for the Seventh SUSS Championship',
    link: 'https://docs.google.com/presentation/d/1mxQUzKvw147NF-bWqrQKwa62t20wfL2Ls4f91EYNH1Y/edit?usp=sharing',
    imageUrl:
      'https://api.squarers.club/api/tournaments/image?name=seventh_suss_championship&big=true',
  },
  {
    title: 'The Sixth SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering the interpretations of the rules for the Sixth SUSS Championship',
    link: 'https://docs.google.com/presentation/d/11w2Y5xxK0YuzQu2AhZvCv4zwsjtgIibLtGypKbicdnI/edit?usp=sharing',
    imageUrl:
      'https://api.squarers.club/api/tournaments/image?name=sixth_suss_championship&big=true',
  },
  {
    title: 'The Fifth SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering the interpretations of the rules for the Fifth SUSS Championship',
    link: 'https://docs.google.com/presentation/d/1VkYuVcabr1jVMfTHc7EyL6Q0DGcPTJmXHYd2NUz3pFA/edit?usp=sharing',
    imageUrl:
      'https://api.squarers.club/api/tournaments/image?name=fifth_suss_championship&big=true',
  },
  {
    title: 'The Fourth SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering the interpretations of the rules for the Fourth SUSS Championship',
    link: 'https://docs.google.com/presentation/d/19f1aP1ucWNLmslApekfMef_Lu1qsh8ckf3zTYA2P-VE/edit?usp=sharing',
    imageUrl:
      'https://api.squarers.club/api/tournaments/image?name=fourth_suss_championship&big=true',
  },
  {
    title: 'The Third SUSS Championship UQP',
    description:
      'The Briefing presented by the SUSS officiating core covering the interpretations of the rules for the Third SUSS Championship',
    link: 'https://docs.google.com/presentation/d/1rHmIFjmRfNyh9SzVVY89OGPxwplXc3-R4JXnSIa03Sk/edit?usp=sharing',
    imageUrl:
      'https://api.squarers.club/api/tournaments/image?name=third_suss_championship&big=true',
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
              sm: 4,
              md: 3,
              lg: 2,
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
              sm: 4,
              md: 3,
              lg: 2,
            }}
          >
            {GenerateDocumentBubble(t)}
          </Grid.Col>
        ))}
      </Grid>
    </SidebarLayout>
  );
}
