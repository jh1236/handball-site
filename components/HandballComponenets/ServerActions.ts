'use client';

import React, { useCallback, useEffect } from 'react';
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

export function useUserData() {
  const [permissions, setPermissions] = React.useState<{ [key: string]: number } | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  useEffect(() => {
    const timeout = localStorage.getItem('timeout');
    if (timeout) {
      const ms = Number.parseFloat(timeout);
      if (ms < Date.now()) {
        localLogout();
      }
    } else {
      localLogout();
    }
    const tempPerms = JSON.parse(localStorage.getItem('permissions') ?? 'null');
    if (tempPerms) {
      setPermissions(tempPerms);
      setUsername(localStorage.getItem('username'));
    } else {
      setPermissions(null);
    }
  }, []);
  return {
    isAdmin: useCallback(
      (tournament?: string) => (permissions?.[tournament ?? 'base'] ?? 0) >= 5,
      [permissions]
    ),
    isLoggedIn: useCallback(
      (tournament?: string) => (permissions?.[tournament ?? 'base'] ?? 0) >= 1,
      [permissions]
    ),
    isOfficial: useCallback(
      (tournament?: string) => (permissions?.[tournament ?? 'base'] ?? 0) >= 2,
      [permissions]
    ),
    isTournamentDirector: useCallback(
      (tournament?: string) => (permissions?.[tournament ?? 'base'] ?? 0) >= 4,
      [permissions]
    ),
    isUmpireManager: useCallback(
      (tournament?: string) => (permissions?.[tournament ?? 'base'] ?? 0) >= 3,
      [permissions]
    ),
    loading: permissions === null,
    permissions,
    setPermissions,
    setUsername,
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
