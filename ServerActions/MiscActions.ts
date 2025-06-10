import { localLogout, SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function getQOTD(): Promise<{
  quote: string;
  author: string;
}> {
  const url = new URL('/api/qotd', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}
