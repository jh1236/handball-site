'use client';

import React, { useEffect } from 'react';
import { SERVER_ADDRESS } from '@/app/config';

export async function tokenFetcher(url: string, args: any = {}) {
  const res = await tokenFetch(url, args);
  return res.json();
}

export function localLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('permissionLevel');
  localStorage.removeItem('username');
  localStorage.removeItem('timeout');
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
  const [permissions, setPermissions] = React.useState<{ [key: string]: number } | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  useEffect(() => {
    if (loggedIn()) {
      const timeout = localStorage.getItem('timeout');
      if (timeout) {
        const ms = Number.parseFloat(timeout);
        if (ms < Date.now()) {
          localLogout();
        }
      }
      setPermissions(JSON.parse(localStorage.getItem('permissions') ?? '{}'));
      setUsername(localStorage.getItem('username'));
    } else {
      setPermissions({});
    }
  }, []);
  return {
    setUsername,
    setPermissions,
    loading: permissions === null,
    isAdmin: (tournament?: string) => tournament && (permissions?.[tournament] ?? 0) === 5,
    isOfficial: (tournament?: string) => tournament && (permissions?.[tournament] ?? 0) >= 2,
    isUmpireManager: (tournament?: string) => tournament && (permissions?.[tournament] ?? 0) >= 3,
    isTournamentDirector: (tournament?: string) => tournament && (permissions?.[tournament] ?? 0) >= 4,
    isLoggedIn: (tournament?: string) => tournament && (permissions?.[tournament] ?? 0) >= 1,
    permissions,
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
