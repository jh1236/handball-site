import { tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SERVER_ADDRESS } from '@/app/config';

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
