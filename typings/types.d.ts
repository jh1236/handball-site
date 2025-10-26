declare module 'react-hook-screen-orientation' {
  export default function useScreenOrientation():
    | 'portrait-primary'
    | 'landscape-primary'
    | 'portrait-secondary'
    | 'landscape-secondary';
}
