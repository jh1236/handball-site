import { tokenFetch } from '@/components/HandballComponenets/ServerActions';

export function loginAction(
  userId: string,
  password: string
): Promise<{ token: string; username: string; permissionLevel: number }> {
  const body: any = {
    userId,
    password,
  };

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
    return response.json();
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
