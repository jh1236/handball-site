'use client';

import React, { useEffect } from 'react';
import {
  Avatar,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Skeleton,
  Space,
  Text,
  Title,
} from '@mantine/core';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getDocumentsIndex } from '@/ServerActions/DocumentActions';
import { DocumentStructure, TournamentStructure } from '@/ServerActions/types';

type documentInfo = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

function BasicDocumentBubble({ link, imageUrl, description, title }: documentInfo) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component="a"
      href={link}
      target={link !== '#' ? '_blank' : undefined}
    >
      <Card.Section>
        <Image src={imageUrl} height="100%" alt={title} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{title}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Card>
  );
}
const loadingBubble = (
  <Paper w="auto" h={300} shadow="xl" p={20} m={10} pos="relative" style={{ overflow: 'hidden' }}>
    <Space h="md"></Space>
    <Center>
      <Skeleton circle height={200}></Skeleton>
    </Center>
    <Center mb={5}>
      <Skeleton h={8} mt={6} radius="xl" w="90%"></Skeleton>
    </Center>
    <Center>
      <Skeleton h={6} mt={6} radius="xl" w="90%"></Skeleton>
    </Center>
    <Center>
      <Skeleton h={6} mt={6} radius="xl" w="90%"></Skeleton>
    </Center>
  </Paper>
);
function TournamentDocumentBubble({
  tournament,
  documents,
}: {
  tournament: TournamentStructure;
  documents: DocumentStructure[];
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)}>
        <Title order={2} ta="center">
          Documents for {tournament.name}
        </Title>
        {documents.map((doc) => (
          <Paper
            shadow="xl"
            m={5}
            component="a"
            href={doc.link}
            className="hideLink"
            target={doc.link !== '#' ? '_blank' : undefined}
          >
            <Flex flex="space-between" align="center" justify="left" p={10}>
              <Avatar src={tournament.imageUrl} alt={tournament.imageUrl} mr={15} />
              <Text>{doc.name}</Text>
            </Flex>
          </Paper>
        ))}
      </Modal>
      <Card shadow="sm" padding="lg" radius="md" withBorder onClick={() => setOpen(true)}>
        <Card.Section>
          <Image src={tournament.imageUrl} height="100%" alt={tournament.name} />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{document.title}</Text>
        </Group>

        <Text size="sm" c="dimmed">
          The archived documents from {tournament.name}
        </Text>
      </Card>
    </>
  );
}

export default function DocumentPage() {
  const [index, setIndex] = React.useState<
    | {
        tournamentDocuments: { tournament: TournamentStructure; documents: DocumentStructure[] }[];
        otherDocuments: DocumentStructure[];
      }
    | undefined
  >(undefined);
  useEffect(() => {
    getDocumentsIndex().then(setIndex);
  }, []);

  if (!index) {
    return (
      <SidebarLayout>
        <Title>Current Documents</Title>
        <Grid w="98.5%">
          {Array.from({ length: 5 }).map(() => (
            <Grid.Col
              span={{
                base: 6,
                sm: 4,
                md: 3,
                lg: 2,
              }}
            >
              {loadingBubble}
            </Grid.Col>
          ))}
        </Grid>
        <Title>Archived Documents</Title>
        <Grid w="98.5%">
          {Array.from({ length: 10 }).map(() => (
            <Grid.Col
              span={{
                base: 6,
                sm: 4,
                md: 3,
                lg: 2,
              }}
            >
              {loadingBubble}
            </Grid.Col>
          ))}
        </Grid>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Title>Current Documents</Title>
      <Grid w="98.5%">
        {index?.otherDocuments.map((d) => (
          <Grid.Col
            span={{
              base: 6,
              sm: 4,
              md: 3,
              lg: 2,
            }}
          >
            <BasicDocumentBubble
              title={d.name}
              description={d.description}
              imageUrl=""
              link={d.link}
            />
          </Grid.Col>
        ))}
      </Grid>
      <Title>Archived Documents</Title>
      <Grid w="98.5%">
        {index?.tournamentDocuments.toReversed().map((t) => (
          <Grid.Col
            span={{
              base: 6,
              sm: 4,
              md: 3,
              lg: 2,
            }}
          >
            <TournamentDocumentBubble tournament={t.tournament} documents={t.documents} />
          </Grid.Col>
        ))}
      </Grid>
    </SidebarLayout>
  );
}
