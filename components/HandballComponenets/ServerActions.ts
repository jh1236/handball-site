export const SERVER_ADDRESS = 'https://squarers.org';
// export const SERVER_ADDRESS = 'http://localhost:25565';
// export const SERVER_ADDRESS = 'http://49.192.25.179:25565';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
