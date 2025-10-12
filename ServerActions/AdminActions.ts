import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function requestBackup(): Promise<void> {
  const url = new URL('/api/test/backup', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: JSON.stringify({}),
  }).then((response) => {
    if (response.status === 401) {
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
    if (response.status === 401) {
      localLogout();
      return Promise.reject();
    }
    return Promise.resolve();
  });
}

export function requestClearLog(): Promise<void> {
  const url = new URL('/api/test/log/clear', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: JSON.stringify({}),
  }).then((response) => {
    if (response.status === 401) {
      localLogout();
      return Promise.reject();
    }
    return Promise.resolve();
  });
}

export function getLog(): Promise<string> {
  const url = new URL('/api/test/log', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (response.status === 401) {
      localLogout();
      return Promise.reject();
    }
    return response.json().then((json) => json.log);
  });
}
