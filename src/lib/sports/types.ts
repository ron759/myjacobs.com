export type League = 'MLB' | 'NHL' | 'NFL' | 'CFB' | 'CBB';

export type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed' | 'unknown';

export interface GameInfo {
	id: string;
	league: League;
	team: string;
	opponent: string;
	isHome: boolean;
	startTimeUTC: string;
	venue?: string;
	broadcast?: string;
	isNationalTV: boolean;
	link?: string;
	status: GameStatus;
	statusDetail?: string;
	teamScore?: number;
	opponentScore?: number;
}

export interface PlayerStatLine {
	label: string;
	value: string;
}

export interface PlayerInfo {
	name: string;
	team: string;
	league: League;
	position?: string;
	stats: PlayerStatLine[];
	updatedAt: string;
}

export interface Scoreboard {
	upcoming: GameInfo[];
	recent: GameInfo[];
	live: GameInfo[];
	hasLive: boolean;
	generatedAt: string;
}

export interface PlayersPayload {
	players: PlayerInfo[];
	generatedAt: string;
}
