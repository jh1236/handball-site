import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function requestBackup(): Promise<void> {
  const url = new URL('/api/test/backup', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: JSON.stringify({}),
  }).then((response) => {
    if (!response.ok) {
      localLogout();
      return Promise.reject();
    }
    return Promise.resolve();
  });
}

export function requestServerUpdate(): Promise<void> {
  const url = new URL('/api/test/update', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: JSON.stringify({}),
  }).then((response) => {
    if (!response.ok) {
      localLogout();
      return Promise.reject();
    }
    return Promise.resolve();
  });
}
