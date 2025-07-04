import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { TeamStructure } from '@/ServerActions/types';

export function uploadTeamImage(file: File, name: string): Promise<TeamStructure> {
  const formData = new FormData();
  formData.append('file', file, name);

  const url = new URL('/api/image/teams/upload', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject();
    }
    return response.json().then((j: { team: TeamStructure }) => j.team);
  });
}

export function uploadPlayerImage(file: File, name: string): Promise<void> {
  const formData = new FormData();
  formData.append('file', file, name);

  const url = new URL('/api/image/people/upload', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject();
    }
    return Promise.resolve();
  });
}
