import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SearchableName } from '@/ServerActions/types';

export function getQOTD(): Promise<{
  quote: string;
  author: string;
}> {
  const url = new URL('/api/qotd', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

export function castVote(teamSearchableName: SearchableName): Promise<void> {
  //TODO: MAKE THIS FUNCTION
  return Promise.resolve();
}

export function getVotes(teamSearchableName: SearchableName): Promise<number> {
  return new Promise((resolve) => { resolve(Math.ceil(Math.random() * 5)); });
}
