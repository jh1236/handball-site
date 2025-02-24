import { tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function loginAction(userId: string, password: string, remember: boolean): Promise<void> {
  const body: any = {
    userId,
    password,
  };
  if (remember) {
    body.longSession = remember;
  }

  return tokenFetch('/login/', {
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
      localStorage.setItem('permissionLevel', `${data.permissionLevel}`);
    });
  });
}

export function logoutAction(): Promise<void> {
  return tokenFetch('/logout/', {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('permissionLevel');
    return Promise.resolve();
  });
}

export function setUserImage(imageLocation: string): Promise<void> {
  const body: any = {
    imageLocation,
  };

  return tokenFetch('/image', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}
