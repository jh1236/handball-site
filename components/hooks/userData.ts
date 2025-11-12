'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { localLogout } from '@/components/HandballComponenets/ServerActions';

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
  const isAdmin = useMemo(() => (permissions?.base ?? 0) >= 5, [permissions]);
  return {
    isAdmin,
    isLoggedIn: useCallback(
      (tournament?: string) => isAdmin || (permissions?.[tournament ?? 'base'] ?? 0) >= 1,
      [isAdmin, permissions]
    ),
    isOfficial: useCallback(
      (tournament?: string) => isAdmin || (permissions?.[tournament ?? 'base'] ?? 0) >= 2,
      [isAdmin, permissions]
    ),
    isTournamentDirector: useCallback(
      (tournament?: string) => isAdmin || (permissions?.[tournament ?? 'base'] ?? 0) >= 4,
      [isAdmin, permissions]
    ),
    isUmpireManager: useCallback(
      (tournament?: string) => isAdmin || (permissions?.[tournament ?? 'base'] ?? 0) >= 3,
      [isAdmin, permissions]
    ),
    loading: permissions === null,
    permissions,
    setPermissions,
    setUsername,
    username,
  };
}

export function useUserSettings() {
  const [useClassicScorer, _setUseClassicScorer] = React.useState<boolean>(false);
  useEffect(() => {
    _setUseClassicScorer((localStorage.getItem('classicScorer') ?? 'false') === 'true');
  }, []);

  const setUseClassicScorer = (value: boolean) => {
    _setUseClassicScorer(value);
    localStorage.setItem('classicScorer', JSON.stringify(value));
  };

  return { useClassicScorer, setUseClassicScorer };
}
