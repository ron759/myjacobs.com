// Ron's tracked teams and players. Add/remove entries here — everything else
// (schedules, scores, stats) is fetched live, nothing else needs to change.

export interface MlbTeamConfig {
	id: number;
	name: string;
}
export interface MlbPlayerConfig {
	id: number;
	name: string;
	team: string;
}
export interface NhlTeamConfig {
	abbrev: string;
	name: string;
}
export interface NhlPlayerConfig {
	id: number;
	name: string;
	team: string;
}
export interface EspnTeamConfig {
	id: string;
	name: string;
}
export interface EspnPlayerConfig {
	id: string;
	name: string;
	team: string;
}

export const MLB_TEAMS: MlbTeamConfig[] = [
	{ id: 144, name: 'Atlanta Braves' },
	{ id: 112, name: 'Chicago Cubs' },
];

export const MLB_PLAYERS: MlbPlayerConfig[] = [
	{ id: 621566, name: 'Matt Olson', team: 'Atlanta Braves' },
	{ id: 660670, name: 'Ronald Acuña Jr.', team: 'Atlanta Braves' },
	{ id: 671739, name: 'Michael Harris II', team: 'Atlanta Braves' },
	{ id: 663586, name: 'Austin Riley', team: 'Atlanta Braves' },
	{ id: 686948, name: 'Drake Baldwin', team: 'Atlanta Braves' },
	{ id: 621020, name: 'Dansby Swanson', team: 'Chicago Cubs' },
];

export const NHL_TEAMS: NhlTeamConfig[] = [{ abbrev: 'NSH', name: 'Nashville Predators' }];

export const NHL_PLAYERS: NhlPlayerConfig[] = [
	{ id: 8476887, name: 'Filip Forsberg', team: 'Nashville Predators' },
	{ id: 8474600, name: 'Roman Josi', team: 'Nashville Predators' },
	{ id: 8477424, name: 'Juuse Saros', team: 'Nashville Predators' },
];

export const NFL_TEAMS: EspnTeamConfig[] = [{ id: '10', name: 'Tennessee Titans' }];

export const NFL_PLAYERS: EspnPlayerConfig[] = [
	{ id: '4688380', name: 'Cam Ward', team: 'Tennessee Titans' },
];

export const CFB_TEAMS: EspnTeamConfig[] = [{ id: '238', name: 'Vanderbilt Commodores' }];

export const CBB_TEAMS: EspnTeamConfig[] = [{ id: '238', name: 'Vanderbilt Commodores' }];

// Logos for the page banner and filter pills, keyed by the same display
// names used everywhere else. Static CDN URLs — no API calls needed.
export const TEAM_LOGOS: Record<string, string> = {
	'Atlanta Braves': 'https://www.mlbstatic.com/team-logos/144.svg',
	'Chicago Cubs': 'https://www.mlbstatic.com/team-logos/112.svg',
	'Nashville Predators': 'https://assets.nhle.com/logos/nhl/svg/NSH_light.svg',
	'Tennessee Titans': 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
	'Vanderbilt Commodores': 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png',
};

export const DISPLAY_TEAMS: string[] = [
	'Atlanta Braves',
	'Chicago Cubs',
	'Nashville Predators',
	'Tennessee Titans',
	'Vanderbilt Commodores',
];

// Networks worth flagging as "national TV" on a game card.
export const NATIONAL_NETWORKS = [
	'ESPN',
	'ESPN2',
	'ABC',
	'FOX',
	'FS1',
	'NBC',
	'CBS',
	'TBS',
	'TNT',
	'Peacock',
	'Apple TV',
	'Prime Video',
	'Amazon',
	'MLB Network',
	'MLBN',
];
