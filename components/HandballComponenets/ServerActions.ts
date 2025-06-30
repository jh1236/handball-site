'use client';

import React, { useEffect } from 'react';
import { SERVER_ADDRESS } from '@/app/config';

export async function tokenFetcher(url: string, args: any = {}) {
  const res = await tokenFetch(url, args);
  return res.json();
}

export function useUserData() {
  // return {
  //   loading: false,
  //   isAdmin: true,
  //   isOfficial: true,
  //   isUmpireManager: true,
  //   isLoggedIn: true,
  //   permissionLevel: 5,
  //   username: 'testing',
  // };
  const [permissionLevel, setPermissionLevel] = React.useState<number | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  useEffect(() => {
    if (loggedIn()) {
      const timeout = localStorage.getItem('timeout');
      if (timeout) {
        const ms = Number.parseFloat(timeout);
        if (ms < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('permissionLevel');
          localStorage.removeItem('username');
          localStorage.removeItem('timeout');
        }
      }
      setPermissionLevel(+(localStorage.getItem('permissionLevel') ?? 0));
      setUsername(localStorage.getItem('username'));
    } else {
      setPermissionLevel(0);
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
