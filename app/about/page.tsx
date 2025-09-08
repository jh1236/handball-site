'use client';

import React from 'react';
import Head from 'next/head';
import { Card, Grid, Group, Image, Text, Title } from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

interface Person {
  name: string;
  searchable: string;
  role: string;
  description: string;
}

const people: Person[] = [
  {
    name: 'Jared Healy',
    searchable: 'jared_healy',
    role: 'Developer, Event Co-ordinator',
    description:
      "Jared is the heart and soul of the Squarers' team. He has been responsible for organising every" +
      ' tournament to date, and has designed and maintained the handball rules, and continues to ' +
      'introduce new innovations to the sport to this day.',
  },
  {
    name: 'Digby Ross',
    searchable: 'digby_ross',
    role: 'Developer',
    description:
      'Digby has been working with the SUSS development team since the start of 2025, and has ' +
      'been a valuable member of the team. Having won three tournaments, he knows his way around a' +
      'handball court.',
  },
  {
    name: 'Aimée Soudure',
    searchable: 'aimee_soudure',
    role: 'Umpiring Liaison',
    description:
      'Aimée has been umpiring handball for as long as there has been handball. She was one of the ' +
      'people responsible for the creation of the rules of handball, and has managed the umpires ' +
      'at more tournaments than most have played.',
  },
  {
    name: 'Nicholas Burvill',
    searchable: 'nicholas_burvill',
    role: 'Social Media Manager',
    description:
      'Nicholas Burvill is a certified handball veteran, playing his first game in the second SUSS ' +
      'championship. He has since gone on to join the umpiring core, and take over the social media ' +
      'management for the SUSS team.',
  },
  {
    name: 'William Prozerska',
    searchable: 'william_prozerska',
    role: 'Artist',
    description:
      'William is a prolific artist who has created many art works for the SUSS team. since' +
      'creating the Eighth SUSS Championship logo, he has been working with the team to create artwork' +
      ' for the sport we all love.',
  },
  {
    name: 'Eva Hajigabriel',
    searchable: 'eva_hajigabriel',
    role: 'Artist, Assistant Social Media Manager',
    description:
      "Eva is one of the longest standing members of the Squarers' team, being engaged since the first " +
      'tournament.  She is responsible for the SUSS logo, as well as countless tournament logos. ' +
      'Her tireless work on the art for handball is not to go understated.',
  },
];

function personToPaper(person: Person) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component="a"
      href={`/players/${person.searchable}`}
    >
      <Card.Section m={10}>
        <Image
          src={`${SERVER_ADDRESS}/api/people/image?name=${person.searchable}`}
          height="100%"
          alt={person.name}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Title order={2}>{person.name}</Title>
        <Text>
          <i>{person.role}</i>
        </Text>
      </Group>

      <Text size="sm" c="dimmed">
        {person.description}
      </Text>
    </Card>
  );
}

export default function CreditsPage() {
  return (
    <SidebarLayout>
      <Head>
        <title>Credits - Squarers.club</title>
      </Head>
      <Title>Our Team</Title>
      <Grid w="98.5%">
        {people.map((p) => (
          <Grid.Col
            span={{
              base: 6,
              sm: 4,
              md: 3,
              lg: 2,
            }}
          >
            {personToPaper(p)}
          </Grid.Col>
        ))}
      </Grid>
    </SidebarLayout>
  );
}
