'use client';

import { SERVER_ADDRESS } from '@/app/config';

export async function tokenFetcher(url: string, args: any = {}) {
  const res = await tokenFetch(url, args);
  return res.json();
}

export function localLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('permissions');
  localStorage.removeItem('username');
  localStorage.removeItem('timeout');
}

function loggedIn() {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem('token') !== null;
}

export function tokenFetch(url: string | URL, args: any = {}) {
  if (loggedIn()) {
    if (!args.headers) {
      args.headers = {};
    }
    args.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  if (typeof url === 'string' && !url.startsWith(SERVER_ADDRESS)) {
    return fetch(`${SERVER_ADDRESS}${url}`, args);
  }
  return fetch(url, args);
}

export function searchableOf(name: string) {
  return name.toLowerCase().replace(' ', '_').replace('the_', '');
}
