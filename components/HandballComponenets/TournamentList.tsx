import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid, Image, List, Skeleton, Tabs } from '@mantine/core';
import { getTournaments } from '@/ServerActions/TournamentActions';
import { TournamentStructure } from '@/ServerActions/types';

export function TournamentList() {
  const [tournaments, setTournaments] = useState<TournamentStructure[]>();
  useEffect(() => {
    getTournaments().then((t) => setTournaments(t.toReversed()));
  }, []);

  if (!tournaments) {
    return (
      <Tabs style={{ minHeight: 350 }} defaultValue="inProgress">
        <Tabs.List grow>
          <Tabs.Tab value="inProgress">In Progress and Upcoming</Tabs.Tab>
          <Tabs.Tab value="done">Completed</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="inProgress" m={20}>
          <List>
            {Array.from({ length: 2 }).map((_, i) => (
              <List.Item key={i} icon={<Skeleton circle height={50}></Skeleton>}>
                <Skeleton mt={6} h={8} w="70%"></Skeleton>
              </List.Item>
            ))}
          </List>
        </Tabs.Panel>
        <Tabs.Panel value="done" m={20}>
          <List>
            {Array.from({ length: 8 }).map((_, i) => (
              <List.Item key={i} icon={<Skeleton circle height={50}></Skeleton>}>
                <Skeleton mt={6} h={8} w="500px"></Skeleton>
                <Skeleton mt={6} h={8} w="350px"></Skeleton>
              </List.Item>
            ))}
          </List>
        </Tabs.Panel>
      </Tabs>
    );
  }
  return (
    <Tabs style={{ minHeight: 350 }} defaultValue="inProgress">
      <Tabs.List grow>
        <Tabs.Tab value="inProgress">In Progress and Upcoming</Tabs.Tab>
        <Tabs.Tab value="done">Completed</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="inProgress" m={20}>
        <List>
          {tournaments
            ?.filter((a) => !a.finished)
            .map((a, i) => (
              <List.Item
                key={i}
                icon={
                  <Link className="hideLink" href={`/${a.searchableName}`}>
                    <Image
                      src={a.imageUrl}
                      alt={a.name}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  </Link>
                }
              >
                <Link className="hideLink" href={`/${a.searchableName}`}>
                  {a.name}
                </Link>
              </List.Item>
            ))}
        </List>
      </Tabs.Panel>
      <Tabs.Panel value="done" m={20}>
        <Grid>
          <Grid.Col
            span={{ md: tournaments?.filter((a) => a.finished).length > 5 ? 6 : 12, base: 12 }}
          >
            <List>
              {tournaments
                ?.filter((a) => a.finished)
                .slice(0, 5)
                .map((a, i) => (
                  <List.Item
                    key={i}
                    icon={
                      <Link className="hideLink" href={`/${a.searchableName}`}>
                        <Image
                          src={a.imageUrl}
                          alt={a.name}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                      </Link>
                    }
                  >
                    <Link className="hideLink" href={`/${a.searchableName}`}>
                      {a.name}
                    </Link>
                  </List.Item>
                ))}
            </List>
          </Grid.Col>
          {tournaments?.filter((a) => a.finished).length > 5 && (
            <Grid.Col span={{ md: 6 }} visibleFrom="md">
              <List>
                {tournaments
                  ?.filter((a) => a.finished)
                  .splice(5, 10)
                  .map((a, i) => (
                    <List.Item
                      key={i}
                      icon={
                        <Link className="hideLink" href={`/${a.searchableName}`}>
                          <Image
                            src={a.imageUrl}
                            alt={a.name}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                        </Link>
                      }
                    >
                      <Link className="hideLink" href={`/${a.searchableName}`}>
                        {a.name}
                      </Link>
                    </List.Item>
                  ))}
              </List>
            </Grid.Col>
          )}
        </Grid>
      </Tabs.Panel>
    </Tabs>
  );
}
