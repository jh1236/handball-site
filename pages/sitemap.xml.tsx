//pages/sitemap.xml.js
import { Http2ServerResponse } from 'node:http2';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { getTeams } from '@/ServerActions/TeamActions';
import { getTournaments } from '@/ServerActions/TournamentActions';
import { PersonStructure, TeamStructure, TournamentStructure } from '@/ServerActions/types';

function generateSiteMap(
  tournaments: TournamentStructure[],
  teams: TeamStructure[],
  players: PersonStructure[]
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://squarers.club</loc>
     </url>
     <url>
       <loc>https://squarers.club/players</loc>
     </url>
     <url>
       <loc>https://squarers.club/officials</loc>
     </url>
     <url>
       <loc>https://squarers.club/teams</loc>
     </url>
     <url>
       <loc>https://squarers.club/ladder</loc>
     </url>
     <url>
       <loc>https://squarers.club/credits</loc>
     </url>
     ${tournaments
       .map(
         ({ searchableName }) => `
               <url>
                <loc>https://squarers.club/${searchableName}/players</loc>
               </url>
               <url>
                 <loc>https://squarers.club/${searchableName}/officials</loc>
               </url>
               <url>
                 <loc>https://squarers.club/${searchableName}/teams</loc>
               </url>
               <url>
                 <loc>https://squarers.club/${searchableName}/ladder</loc>
               </url>
               <url>
                 <loc>https://squarers.club/${searchableName}/fixtures</loc>
               </url>
     `
       )
       .join('')}
     ${players
       .map(
         ({ searchableName }) => `
               <url>
                <loc>https://squarers.club/players/${searchableName}</loc>
               </url>
     `
       )
       .join('')}
     ${teams
       .map(
         ({ searchableName }) => `
               <url>
                 <loc>https://squarers.club/teams/${searchableName}</loc>
               </url>
     `
       )
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: Http2ServerResponse }) {
  // We make an API call to gather the URLs for our site
  const tournamentsReq = getTournaments();
  const teamsReq = getTeams({});
  const playersReq = getPlayers({});
  const [tournaments, teams, players] = await Promise.all([tournamentsReq, teamsReq, playersReq]);
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(tournaments, teams.teams, players.players);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
