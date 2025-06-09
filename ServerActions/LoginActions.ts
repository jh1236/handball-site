import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function loginAction(userId: string, password: string, remember: boolean): Promise<void> {
  const body: any = {
    userId,
    password,
  };
  if (remember) {
    body.longSession = remember;
  }

  return tokenFetch('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json().then((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('timeout', `${data.timeout * 2000}`);
      localStorage.setItem('permissionLevel', `${data.permissionLevel}`);
    });
  });
}

export function logoutAction(): Promise<void> {
  return tokenFetch('/api/auth/logout/', {
    method: 'GET',
  }).then((response) => {
    //we always want to clear the local tokens; the only possible error
    //is that we weren't logged in anyway
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('permissionLevel');
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function setUserImage(imageLocation: string): Promise<void> {
  const body: any = {
    imageLocation,
  };

  return tokenFetch('/api/image', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}
