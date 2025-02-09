// export const SERVER_ADDRESS = 'https://api.squarers.club';
export const SERVER_ADDRESS = 'http://localhost:5001/api';
// export const SERVER_ADDRESS = 'http://49.192.26.182:5001';

export async function tokenFetcher(url: string, args: any = {}) {
  const res = await tokenFetch(url, args);
  return res.json();
}

export function getUsername(): string | null {
  return loggedIn() ? localStorage.getItem('username') : null;
}

export function loggedIn() {
  return localStorage.getItem('token') !== null;
}

export function isAdmin() {
  return loggedIn() && +localStorage.getItem('permissionLevel')! === 5;
}

export function isOfficial() {
  return loggedIn() && +localStorage.getItem('permissionLevel')! >= 2;
}

export function isUmpireManager() {
  return isAdmin() || +localStorage.getItem('permissionLevel')! === 4;
}

export function tokenFetch(url: string | URL, args: any = {}) {
  if (loggedIn()) {
    if (!args.headers) {
      args.headers = {};
    }
    args.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  if (typeof url === 'string') {
    return fetch(`${SERVER_ADDRESS}${url}`, args);
  }
  url.pathname = `/api${url.pathname}`;
  return fetch(url, args);
}

export function searchableOf(name: string) {
  return name.toLowerCase().replace(' ', '_').replace('the_', '');
}
