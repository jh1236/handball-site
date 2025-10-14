import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { DocumentStructure, TournamentStructure } from '@/ServerActions/types';

export function getDocumentsIndex(): Promise<{
  tournamentDocuments: { tournament: TournamentStructure; documents: DocumentStructure[] }[];
  otherDocuments: DocumentStructure[];
}> {
  return tokenFetch('/api/documents/index', {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}
