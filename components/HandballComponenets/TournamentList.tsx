import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Image, List, Tabs } from '@mantine/core';
import { getTournaments } from '@/ServerActions/TournamentActions';
import { TournamentStructure } from '@/ServerActions/types';

export function TournamentList() {
  const [tournaments, setTournaments] = useState<TournamentStructure[]>();
  useEffect(() => {
    getTournaments().then(setTournaments);
  }, []);
  return (
    <Tabs style={{ minHeight: 400 }} defaultValue="done">
      <Tabs.List>
        <Tabs.Tab value="done">Completed</Tabs.Tab>
        <Tabs.Tab value="inProgress">In Progress and Upcoming</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="done" m={20}>
        <List>
          {tournaments
            ?.filter((a) => a.finished)
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
                <List></List>
              </List.Item>
            ))}
        </List>
      </Tabs.Panel>
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
                <List></List>
              </List.Item>
            ))}
        </List>
      </Tabs.Panel>
    </Tabs>
  );
}
