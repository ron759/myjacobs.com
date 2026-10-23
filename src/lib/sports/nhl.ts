import type { GameInfo, PlayerInfo, PlayerStatLine } from './types';
import { isNationalBroadcast } from './util';

const NHL_API = 'https://api-web.nhle.com/v1';

export async function getNhlTeamGames(abbrev: string, teamName: string): Promise<GameInfo[]> {
	try {
		const res = await fetch(`${NHL_API}/club-schedule/${abbrev}/month/now`);
		if (!res.ok) return [];
		const data = await res.json();
		const games: GameInfo[] = [];

		for (const g of data.games ?? []) {
			const isHome = g.homeTeam?.abbrev === abbrev;
			const self = isHome ? g.homeTeam : g.awayTeam;
			const opp = isHome ? g.awayTeam : g.homeTeam;

			let status: GameInfo['status'] = 'scheduled';
			if (g.gameState === 'LIVE' || g.gameState === 'CRIT') status = 'live';
			else if (g.gameState === 'FINAL' || g.gameState === 'OFF') status = 'final';
			else if (g.gameState === 'PPD') status = 'postponed';

			const broadcast: string | undefined = (g.tvBroadcasts ?? [])
				.map((b: any) => b?.network)
				.filter(Boolean)
				.join(', ') || undefined;

			const oppName =
				opp?.placeName?.default && opp?.commonName?.default
					? `${opp.placeName.default} ${opp.commonName.default}`
					: (opp?.abbrev ?? 'TBD');

			games.push({
				id: `nhl-${g.id}`,
				league: 'NHL',
				team: teamName,
				opponent: oppName,
				isHome,
				startTimeUTC: g.startTimeUTC,
				venue: g.venue?.default,
				broadcast,
				isNationalTV: isNationalBroadcast(broadcast),
				link: `https://www.nhl.com/gamecenter/${g.id}`,
				status,
				statusDetail: g.gameState,
				teamScore: typeof self?.score === 'number' ? self.score : undefined,
				opponentScore: typeof opp?.score === 'number' ? opp.score : undefined,
			});
		}
		return games;
	} catch {
		return [];
	}
}

export async function getNhlPlayerStats(
	id: number,
	name: string,
	team: string
): Promise<PlayerInfo | null> {
	try {
		const res = await fetch(`${NHL_API}/player/${id}/landing`);
		if (!res.ok) return null;
		const data = await res.json();
		const sub = data.featuredStats?.regularSeason?.subSeason;
		const position: string | undefined = data.position;
		const isGoalie = position === 'G';

		const stats: PlayerStatLine[] = sub
			? isGoalie
				? [
						{ label: 'GP', value: String(sub.gamesPlayed ?? '—') },
						{ label: 'W', value: String(sub.wins ?? '—') },
						{
							label: 'GAA',
							value:
								typeof sub.goalsAgainstAvg === 'number'
									? sub.goalsAgainstAvg.toFixed(2)
									: String(sub.goalsAgainstAvg ?? '—'),
						},
						{
							label: 'SV%',
							value:
								typeof sub.savePctg === 'number' ? sub.savePctg.toFixed(3) : String(sub.savePctg ?? '—'),
						},
					]
				: [
						{ label: 'G', value: String(sub.goals ?? '—') },
						{ label: 'A', value: String(sub.assists ?? '—') },
						{ label: 'P', value: String(sub.points ?? '—') },
						{ label: '+/-', value: String(sub.plusMinus ?? '—') },
					]
			: [];

		return { name, team, league: 'NHL', position, stats, updatedAt: new Date().toISOString() };
	} catch {
		return null;
	}
}
