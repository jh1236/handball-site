import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function getQOTD(): Promise<{
  quote: string;
  author: string;
}> {
  const url = new URL('/qotd', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json();
  });
}
