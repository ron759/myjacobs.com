import {
	CBB_TEAMS,
	CFB_TEAMS,
	MLB_PLAYERS,
	MLB_TEAMS,
	NFL_PLAYERS,
	NFL_TEAMS,
	NHL_PLAYERS,
	NHL_TEAMS,
} from '../../data/sports-config';
import { getMlbPlayerStats, getMlbTeamGames } from './mlb';
import { getNhlPlayerStats, getNhlTeamGames } from './nhl';
import { getEspnTeamGames, getNflPlayerStats } from './espn';
import type { GameInfo, PlayerInfo, PlayersPayload, Scoreboard } from './types';
import { withTimeout } from './util';

const FETCH_TIMEOUT_MS = 8000;

// Tiny in-memory cache. Serverless instances get reused between nearby
// requests, so this cuts down on hammering the upstream APIs without
// needing a database — it just won't help on a cold start.
let scoreboardCache: { data: Scoreboard; expires: number } | null = null;
let playersCache: { data: PlayersPayload; expires: number } | null = null;

export async function getScoreboard(): Promise<Scoreboard> {
	if (scoreboardCache && scoreboardCache.expires > Date.now()) {
		return scoreboardCache.data;
	}

	const jobs: Promise<GameInfo[]>[] = [
		...MLB_TEAMS.map((t) => withTimeout(getMlbTeamGames(t.id, t.name), FETCH_TIMEOUT_MS, [])),
		...NHL_TEAMS.map((t) =>
			withTimeout(getNhlTeamGames(t.abbrev, t.name), FETCH_TIMEOUT_MS, [])
		),
		...NFL_TEAMS.map((t) =>
			withTimeout(getEspnTeamGames('NFL', t.id, t.name), FETCH_TIMEOUT_MS, [])
		),
		...CFB_TEAMS.map((t) =>
			withTimeout(getEspnTeamGames('CFB', t.id, t.name), FETCH_TIMEOUT_MS, [])
		),
		...CBB_TEAMS.map((t) =>
			withTimeout(getEspnTeamGames('CBB', t.id, t.name), FETCH_TIMEOUT_MS, [])
		),
	];

	const results = await Promise.all(jobs);
	const allGames = results.flat();

	const now = Date.now();
	const live = allGames.filter((g) => g.status === 'live');
	const upcoming = allGames
		.filter((g) => g.status === 'scheduled' && new Date(g.startTimeUTC).getTime() >= now)
		.sort((a, b) => new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime());
	const recent = allGames
		.filter((g) => g.status === 'final')
		.sort((a, b) => new Date(b.startTimeUTC).getTime() - new Date(a.startTimeUTC).getTime())
		.slice(0, 8);

	const scoreboard: Scoreboard = {
		live,
		upcoming,
		recent,
		hasLive: live.length > 0,
		generatedAt: new Date().toISOString(),
	};

	scoreboardCache = {
		data: scoreboard,
		expires: Date.now() + (scoreboard.hasLive ? 20_000 : 120_000),
	};

	return scoreboard;
}

export async function getPlayers(): Promise<PlayersPayload> {
	if (playersCache && playersCache.expires > Date.now()) {
		return playersCache.data;
	}

	const jobs: Promise<PlayerInfo | null>[] = [
		...MLB_PLAYERS.map((p) =>
			withTimeout(getMlbPlayerStats(p.id, p.name, p.team), FETCH_TIMEOUT_MS, null)
		),
		...NHL_PLAYERS.map((p) =>
			withTimeout(getNhlPlayerStats(p.id, p.name, p.team), FETCH_TIMEOUT_MS, null)
		),
		...NFL_PLAYERS.map((p) =>
			withTimeout(getNflPlayerStats(p.id, p.name, p.team), FETCH_TIMEOUT_MS, null)
		),
	];

	const results = await Promise.all(jobs);
	const players = results.filter((p): p is PlayerInfo => p !== null);

	const payload: PlayersPayload = { players, generatedAt: new Date().toISOString() };
	playersCache = { data: payload, expires: Date.now() + 10 * 60 * 1000 };

	return payload;
}
