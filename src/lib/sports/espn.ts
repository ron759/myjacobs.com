import type { GameInfo, League, PlayerInfo, PlayerStatLine } from './types';
import { extractScore, isNationalBroadcast } from './util';

const ESPN_SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN_COMMON = 'https://site.web.api.espn.com/apis/common/v3/sports';

const SPORT_PATHS: Record<'NFL' | 'CFB' | 'CBB', string> = {
	NFL: 'football/nfl',
	CFB: 'football/college-football',
	CBB: 'basketball/mens-college-basketball',
};

// espn.com's public gamecast URLs use a slightly different slug than the
// API path above (e.g. "nfl" not "football/nfl").
const URL_SLUGS: Record<'NFL' | 'CFB' | 'CBB', string> = {
	NFL: 'nfl',
	CFB: 'college-football',
	CBB: 'mens-college-basketball',
};

// How far around "now" we bother keeping games from a full-season schedule.
const WINDOW_PAST_MS = 7 * 24 * 3600 * 1000;
const WINDOW_FUTURE_MS = 21 * 24 * 3600 * 1000;

export async function getEspnTeamGames(
	league: 'NFL' | 'CFB' | 'CBB',
	teamId: string,
	teamName: string
): Promise<GameInfo[]> {
	const path = SPORT_PATHS[league];
	try {
		const res = await fetch(`${ESPN_SITE}/${path}/teams/${teamId}/schedule`);
		if (!res.ok) return [];
		const data = await res.json();
		const games: GameInfo[] = [];
		const now = Date.now();

		for (const event of data.events ?? []) {
			const comp = event.competitions?.[0];
			if (!comp) continue;
			const t = new Date(event.date).getTime();
			if (Number.isNaN(t) || t < now - WINDOW_PAST_MS || t > now + WINDOW_FUTURE_MS) continue;

			const competitors = comp.competitors ?? [];
			const self = competitors.find((c: any) => String(c.team?.id) === String(teamId));
			const opp = competitors.find((c: any) => c !== self);

			const broadcast: string | undefined =
				comp.broadcasts?.[0]?.names?.[0] ?? comp.geoBroadcasts?.[0]?.media?.shortName;

			const stateStr: string | undefined = comp.status?.type?.state; // 'pre' | 'in' | 'post'
			let status: GameInfo['status'] = 'scheduled';
			if (stateStr === 'in') status = 'live';
			else if (stateStr === 'post') {
				status = comp.status?.type?.name === 'STATUS_POSTPONED' ? 'postponed' : 'final';
			}

			games.push({
				id: `${league.toLowerCase()}-${event.id}`,
				league,
				team: teamName,
				opponent: opp?.team?.displayName ?? 'TBD',
				isHome: self?.homeAway === 'home',
				startTimeUTC: event.date,
				venue: comp.venue?.fullName,
				broadcast,
				isNationalTV: isNationalBroadcast(broadcast),
				link: `https://www.espn.com/${URL_SLUGS[league]}/game/_/gameId/${event.id}`,
				status,
				statusDetail: comp.status?.type?.shortDetail ?? comp.status?.type?.description,
				teamScore: extractScore(self?.score),
				opponentScore: extractScore(opp?.score),
			});
		}
		return games;
	} catch {
		return [];
	}
}

interface AthleteStatSpec {
	league: League;
	sportPath: string;
	categoryName: string;
	wantedLabels: string[];
}

export async function getEspnAthleteStats(
	spec: AthleteStatSpec,
	athleteId: string,
	name: string,
	team: string
): Promise<PlayerInfo | null> {
	try {
		const res = await fetch(`${ESPN_COMMON}/${spec.sportPath}/athletes/${athleteId}/stats`);
		if (!res.ok) return null;
		const data = await res.json();
		const categories: any[] = data.categories ?? [];
		const cat = categories.find((c) => c.name === spec.categoryName) ?? categories[0];
		const labels: string[] = cat?.labels ?? [];
		const values: string[] = cat?.statistics?.[0]?.stats ?? [];

		const stats: PlayerStatLine[] = spec.wantedLabels
			.map((label) => {
				const idx = labels.indexOf(label);
				return idx >= 0 && values[idx] !== undefined ? { label, value: values[idx] } : null;
			})
			.filter((s): s is PlayerStatLine => s !== null);

		return { name, team, league: spec.league, stats, updatedAt: new Date().toISOString() };
	} catch {
		return null;
	}
}

export async function getNflPlayerStats(
	athleteId: string,
	name: string,
	team: string
): Promise<PlayerInfo | null> {
	return getEspnAthleteStats(
		{
			league: 'NFL',
			sportPath: 'football/nfl',
			categoryName: 'passing',
			wantedLabels: ['CMP', 'ATT', 'YDS', 'TD', 'INT', 'RTG'],
		},
		athleteId,
		name,
		team
	);
}
