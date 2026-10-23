import type { GameInfo, PlayerInfo, PlayerStatLine } from './types';
import { isNationalBroadcast, toDateStr } from './util';

const MLB_API = 'https://statsapi.mlb.com/api/v1';

export async function getMlbTeamGames(teamId: number, teamName: string): Promise<GameInfo[]> {
	const today = new Date();
	const start = new Date(today);
	start.setDate(start.getDate() - 5);
	const end = new Date(today);
	end.setDate(end.getDate() + 14);
	const url = `${MLB_API}/schedule?sportId=1&teamId=${teamId}&startDate=${toDateStr(start)}&endDate=${toDateStr(end)}&hydrate=broadcasts(all),venue`;

	try {
		const res = await fetch(url);
		if (!res.ok) return [];
		const data = await res.json();
		const games: GameInfo[] = [];

		for (const date of data.dates ?? []) {
			for (const g of date.games ?? []) {
				const isHome = g.teams?.home?.team?.id === teamId;
				const self = isHome ? g.teams?.home : g.teams?.away;
				const opp = isHome ? g.teams?.away : g.teams?.home;
				const abstractState: string | undefined = g.status?.abstractGameState;
				const detailedState: string = g.status?.detailedState ?? '';

				let status: GameInfo['status'] = 'scheduled';
				if (abstractState === 'Live') status = 'live';
				else if (abstractState === 'Final') status = 'final';
				if (/postpon/i.test(detailedState)) status = 'postponed';

				const broadcast: string | undefined = g.broadcasts?.[0]?.name;

				games.push({
					id: `mlb-${g.gamePk}`,
					league: 'MLB',
					team: teamName,
					opponent: opp?.team?.name ?? 'TBD',
					isHome,
					startTimeUTC: g.gameDate,
					venue: g.venue?.name,
					broadcast,
					isNationalTV: isNationalBroadcast(broadcast),
					link: `https://www.mlb.com/gameday/${g.gamePk}`,
					status,
					statusDetail: detailedState || undefined,
					teamScore: typeof self?.score === 'number' ? self.score : undefined,
					opponentScore: typeof opp?.score === 'number' ? opp.score : undefined,
				});
			}
		}
		return games;
	} catch {
		return [];
	}
}

export async function getMlbPlayerStats(
	id: number,
	name: string,
	team: string
): Promise<PlayerInfo | null> {
	const season = new Date().getFullYear();
	const url = `${MLB_API}/people/${id}/stats?stats=season&group=hitting&season=${season}`;

	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const data = await res.json();
		const stat = data.stats?.[0]?.splits?.[0]?.stat;
		const stats: PlayerStatLine[] = stat
			? [
					{ label: 'AVG', value: String(stat.avg ?? '—') },
					{ label: 'HR', value: String(stat.homeRuns ?? '—') },
					{ label: 'RBI', value: String(stat.rbi ?? '—') },
					{ label: 'OPS', value: String(stat.ops ?? '—') },
					{ label: 'SB', value: String(stat.stolenBases ?? '—') },
				]
			: [];

		return {
			name,
			team,
			league: 'MLB',
			position: undefined,
			stats,
			updatedAt: new Date().toISOString(),
		};
	} catch {
		return null;
	}
}
