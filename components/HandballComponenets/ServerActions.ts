'use client';

import React, { useEffect } from 'react';

export const SERVER_ADDRESS = 'https://api.squarers.club';
// export const SERVER_ADDRESS = 'http://localhost:5001/api';
// export const SERVER_ADDRESS = 'http://49.192.26.182:5001';

export async function tokenFetcher(url: string, args: any = {}) {
  const res = await tokenFetch(url, args);
  return res.json();
}

export function useUserData() {
  const [permissionLevel, setPermissionLevel] = React.useState<number | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  useEffect(() => {
    setPermissionLevel(+(localStorage.getItem('permissionLevel') ?? 0));
    if (loggedIn()) {
      setUsername(localStorage.getItem('username'));
    }
  }, []);
  return {
    loading: permissionLevel === null,
    isAdmin: (permissionLevel ?? 5) === 5,
    isOfficial: (permissionLevel ?? 5) >= 2,
    isUmpireManager: (permissionLevel ?? 5) >= 4,
    isLoggedIn: (permissionLevel ?? 5) !== 0,
    permissionLevel,
    username,
  };
}

function loggedIn() {
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
