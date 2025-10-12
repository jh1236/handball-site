import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { TeamStructure, TournamentStructure } from '@/ServerActions/types';

export function uploadTeamImage(
  file: File,
  name: string,
  tournament?: string
): Promise<TeamStructure> {
  const formData = new FormData();
  formData.append('file', file, name);
  if (tournament) {
    formData.append('tournament', tournament);
  }

  const url = new URL('/api/image/teams/upload', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject();
    }
    return response.json().then((j: { team: TeamStructure }) => j.team);
  });
}

export function uploadTournamentImage(file: File, name: string): Promise<TournamentStructure> {
  const formData = new FormData();
  formData.append('file', file, name);

  const url = new URL('/api/image/tournament/upload', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject();
    }
    return response.json().then((j: { tournament: TournamentStructure }) => j.tournament);
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
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject();
    }
    return Promise.resolve();
  });
}
