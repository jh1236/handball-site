// export const SERVER_ADDRESS = 'https://squarers.org';
export const SERVER_ADDRESS = 'http://192.168.0.50:25565';
// export const SERVER_ADDRESS = 'http://49.192.26.182:25565';

// export const SERVER_ADDRESS = 'http://charen.ddns.net:25565';

export async function tokenFetcher(url: string, args: any = {}) {
  const res = await tokenFetch(url, args);
  return res.json();
}

export function tokenFetch(url: string, args: any = {}) {
  if (localStorage.getItem('token') !== null) {
    if (!args.headers) {
      args.headers = {};
    }
    args.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return fetch(`${SERVER_ADDRESS}${url}`, args);
}
