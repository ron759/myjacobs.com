// src/data/sports-config.ts
var MLB_TEAMS = [{
	id: 144,
	name: "Atlanta Braves"
}, {
	id: 112,
	name: "Chicago Cubs"
}];
var MLB_PLAYERS = [
	{
		id: 621566,
		name: "Matt Olson",
		team: "Atlanta Braves"
	},
	{
		id: 660670,
		name: "Ronald Acuña Jr.",
		team: "Atlanta Braves"
	},
	{
		id: 671739,
		name: "Michael Harris II",
		team: "Atlanta Braves"
	},
	{
		id: 663586,
		name: "Austin Riley",
		team: "Atlanta Braves"
	},
	{
		id: 686948,
		name: "Drake Baldwin",
		team: "Atlanta Braves"
	},
	{
		id: 621020,
		name: "Dansby Swanson",
		team: "Chicago Cubs"
	}
];
var NHL_TEAMS = [{
	abbrev: "NSH",
	name: "Nashville Predators"
}];
var NHL_PLAYERS = [
	{
		id: 8476887,
		name: "Filip Forsberg",
		team: "Nashville Predators"
	},
	{
		id: 8474600,
		name: "Roman Josi",
		team: "Nashville Predators"
	},
	{
		id: 8477424,
		name: "Juuse Saros",
		team: "Nashville Predators"
	}
];
var NFL_TEAMS = [{
	id: "10",
	name: "Tennessee Titans"
}];
var NFL_PLAYERS = [{
	id: "4688380",
	name: "Cam Ward",
	team: "Tennessee Titans"
}];
var CFB_TEAMS = [{
	id: "238",
	name: "Vanderbilt Commodores"
}];
var CBB_TEAMS = [{
	id: "238",
	name: "Vanderbilt Commodores"
}];
var TEAM_LOGOS = {
	"Atlanta Braves": "https://www.mlbstatic.com/team-logos/144.svg",
	"Chicago Cubs": "https://www.mlbstatic.com/team-logos/112.svg",
	"Nashville Predators": "https://assets.nhle.com/logos/nhl/svg/NSH_light.svg",
	"Tennessee Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png",
	"Vanderbilt Commodores": "https://a.espncdn.com/i/teamlogos/ncaa/500/238.png"
};
var DISPLAY_TEAMS = [
	"Atlanta Braves",
	"Chicago Cubs",
	"Nashville Predators",
	"Tennessee Titans",
	"Vanderbilt Commodores"
];
var NATIONAL_NETWORKS = [
	"ESPN",
	"ESPN2",
	"ABC",
	"FOX",
	"FS1",
	"NBC",
	"CBS",
	"TBS",
	"TNT",
	"Peacock",
	"Apple TV",
	"Prime Video",
	"Amazon",
	"MLB Network",
	"MLBN"
];
// src/lib/sports/util.ts
function isNationalBroadcast(name) {
	if (!name) return false;
	const lower = name.toLowerCase();
	return NATIONAL_NETWORKS.some((n) => lower.includes(n.toLowerCase()));
}
function toDateStr(d) {
	return d.toISOString().slice(0, 10);
}
function extractScore(raw) {
	if (raw === void 0 || raw === null) return void 0;
	if (typeof raw === "number") return Number.isNaN(raw) ? void 0 : raw;
	if (typeof raw === "string") {
		const n = Number(raw);
		return Number.isNaN(n) ? void 0 : n;
	}
	if (typeof raw === "object") {
		const obj = raw;
		if (typeof obj.value === "number" && !Number.isNaN(obj.value)) return obj.value;
		if (typeof obj.displayValue === "string") {
			const n = Number(obj.displayValue);
			return Number.isNaN(n) ? void 0 : n;
		}
	}
}
async function withTimeout(promise, ms, fallback) {
	let timer;
	const timeout = new Promise((resolve) => {
		timer = setTimeout(() => resolve(fallback), ms);
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timer);
	}
}
// src/lib/sports/mlb.ts
var MLB_API = "https://statsapi.mlb.com/api/v1";
async function getMlbTeamGames(teamId, teamName) {
	const today = /* @__PURE__ */ new Date();
	const start = new Date(today);
	start.setDate(start.getDate() - 5);
	const end = new Date(today);
	end.setDate(end.getDate() + 14);
	const url = `${MLB_API}/schedule?sportId=1&teamId=${teamId}&startDate=${toDateStr(start)}&endDate=${toDateStr(end)}&hydrate=broadcasts(all),venue`;
	try {
		const res = await fetch(url);
		if (!res.ok) return [];
		const data = await res.json();
		const games = [];
		for (const date of data.dates ?? []) for (const g of date.games ?? []) {
			const isHome = g.teams?.home?.team?.id === teamId;
			const self = isHome ? g.teams?.home : g.teams?.away;
			const opp = isHome ? g.teams?.away : g.teams?.home;
			const abstractState = g.status?.abstractGameState;
			const detailedState = g.status?.detailedState ?? "";
			let status = "scheduled";
			if (abstractState === "Live") status = "live";
			else if (abstractState === "Final") status = "final";
			if (/postpon/i.test(detailedState)) status = "postponed";
			const broadcast = g.broadcasts?.[0]?.name;
			games.push({
				id: `mlb-${g.gamePk}`,
				league: "MLB",
				team: teamName,
				opponent: opp?.team?.name ?? "TBD",
				isHome,
				startTimeUTC: g.gameDate,
				venue: g.venue?.name,
				broadcast,
				isNationalTV: isNationalBroadcast(broadcast),
				link: `https://www.mlb.com/gameday/${g.gamePk}`,
				status,
				statusDetail: detailedState || void 0,
				teamScore: typeof self?.score === "number" ? self.score : void 0,
				opponentScore: typeof opp?.score === "number" ? opp.score : void 0
			});
		}
		return games;
	} catch {
		return [];
	}
}
async function getMlbPlayerStats(id, name, team) {
	const url = `${MLB_API}/people/${id}/stats?stats=season&group=hitting&season=${(/* @__PURE__ */ new Date()).getFullYear()}`;
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const stat = (await res.json()).stats?.[0]?.splits?.[0]?.stat;
		return {
			name,
			team,
			league: "MLB",
			position: void 0,
			stats: stat ? [
				{
					label: "AVG",
					value: String(stat.avg ?? "—")
				},
				{
					label: "HR",
					value: String(stat.homeRuns ?? "—")
				},
				{
					label: "RBI",
					value: String(stat.rbi ?? "—")
				},
				{
					label: "OPS",
					value: String(stat.ops ?? "—")
				},
				{
					label: "SB",
					value: String(stat.stolenBases ?? "—")
				}
			] : [],
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	} catch {
		return null;
	}
}
// src/lib/sports/nhl.ts
var NHL_API = "https://api-web.nhle.com/v1";
async function getNhlTeamGames(abbrev, teamName) {
	try {
		const res = await fetch(`${NHL_API}/club-schedule/${abbrev}/month/now`);
		if (!res.ok) return [];
		const data = await res.json();
		const games = [];
		for (const g of data.games ?? []) {
			const isHome = g.homeTeam?.abbrev === abbrev;
			const self = isHome ? g.homeTeam : g.awayTeam;
			const opp = isHome ? g.awayTeam : g.homeTeam;
			let status = "scheduled";
			if (g.gameState === "LIVE" || g.gameState === "CRIT") status = "live";
			else if (g.gameState === "FINAL" || g.gameState === "OFF") status = "final";
			else if (g.gameState === "PPD") status = "postponed";
			const broadcast = (g.tvBroadcasts ?? []).map((b) => b?.network).filter(Boolean).join(", ") || void 0;
			const oppName = opp?.placeName?.default && opp?.commonName?.default ? `${opp.placeName.default} ${opp.commonName.default}` : opp?.abbrev ?? "TBD";
			games.push({
				id: `nhl-${g.id}`,
				league: "NHL",
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
				teamScore: typeof self?.score === "number" ? self.score : void 0,
				opponentScore: typeof opp?.score === "number" ? opp.score : void 0
			});
		}
		return games;
	} catch {
		return [];
	}
}
async function getNhlPlayerStats(id, name, team) {
	try {
		const res = await fetch(`${NHL_API}/player/${id}/landing`);
		if (!res.ok) return null;
		const data = await res.json();
		const sub = data.featuredStats?.regularSeason?.subSeason;
		const position = data.position;
		return {
			name,
			team,
			league: "NHL",
			position,
			stats: sub ? position === "G" ? [
				{
					label: "GP",
					value: String(sub.gamesPlayed ?? "—")
				},
				{
					label: "W",
					value: String(sub.wins ?? "—")
				},
				{
					label: "GAA",
					value: typeof sub.goalsAgainstAvg === "number" ? sub.goalsAgainstAvg.toFixed(2) : String(sub.goalsAgainstAvg ?? "—")
				},
				{
					label: "SV%",
					value: typeof sub.savePctg === "number" ? sub.savePctg.toFixed(3) : String(sub.savePctg ?? "—")
				}
			] : [
				{
					label: "G",
					value: String(sub.goals ?? "—")
				},
				{
					label: "A",
					value: String(sub.assists ?? "—")
				},
				{
					label: "P",
					value: String(sub.points ?? "—")
				},
				{
					label: "+/-",
					value: String(sub.plusMinus ?? "—")
				}
			] : [],
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	} catch {
		return null;
	}
}
// src/lib/sports/espn.ts
var ESPN_SITE = "https://site.api.espn.com/apis/site/v2/sports";
var ESPN_COMMON = "https://site.web.api.espn.com/apis/common/v3/sports";
var SPORT_PATHS = {
	NFL: "football/nfl",
	CFB: "football/college-football",
	CBB: "basketball/mens-college-basketball"
};
var URL_SLUGS = {
	NFL: "nfl",
	CFB: "college-football",
	CBB: "mens-college-basketball"
};
var WINDOW_PAST_MS = 6048e5;
var WINDOW_FUTURE_MS = 18144e5;
async function getEspnTeamGames(league, teamId, teamName) {
	const path = SPORT_PATHS[league];
	try {
		const res = await fetch(`${ESPN_SITE}/${path}/teams/${teamId}/schedule`);
		if (!res.ok) return [];
		const data = await res.json();
		const games = [];
		const now = Date.now();
		for (const event of data.events ?? []) {
			const comp = event.competitions?.[0];
			if (!comp) continue;
			const t = new Date(event.date).getTime();
			if (Number.isNaN(t) || t < now - WINDOW_PAST_MS || t > now + WINDOW_FUTURE_MS) continue;
			const competitors = comp.competitors ?? [];
			const self = competitors.find((c) => String(c.team?.id) === String(teamId));
			const opp = competitors.find((c) => c !== self);
			const broadcast = comp.broadcasts?.[0]?.names?.[0] ?? comp.geoBroadcasts?.[0]?.media?.shortName;
			const stateStr = comp.status?.type?.state;
			let status = "scheduled";
			if (stateStr === "in") status = "live";
			else if (stateStr === "post") status = comp.status?.type?.name === "STATUS_POSTPONED" ? "postponed" : "final";
			games.push({
				id: `${league.toLowerCase()}-${event.id}`,
				league,
				team: teamName,
				opponent: opp?.team?.displayName ?? "TBD",
				isHome: self?.homeAway === "home",
				startTimeUTC: event.date,
				venue: comp.venue?.fullName,
				broadcast,
				isNationalTV: isNationalBroadcast(broadcast),
				link: `https://www.espn.com/${URL_SLUGS[league]}/game/_/gameId/${event.id}`,
				status,
				statusDetail: comp.status?.type?.shortDetail ?? comp.status?.type?.description,
				teamScore: extractScore(self?.score),
				opponentScore: extractScore(opp?.score)
			});
		}
		return games;
	} catch {
		return [];
	}
}
async function getEspnAthleteStats(spec, athleteId, name, team) {
	try {
		const res = await fetch(`${ESPN_COMMON}/${spec.sportPath}/athletes/${athleteId}/stats`);
		if (!res.ok) return null;
		const categories = (await res.json()).categories ?? [];
		const cat = categories.find((c) => c.name === spec.categoryName) ?? categories[0];
		const labels = cat?.labels ?? [];
		const values = cat?.statistics?.[0]?.stats ?? [];
		const stats = spec.wantedLabels.map((label) => {
			const idx = labels.indexOf(label);
			return idx >= 0 && values[idx] !== void 0 ? {
				label,
				value: values[idx]
			} : null;
		}).filter((s) => s !== null);
		return {
			name,
			team,
			league: spec.league,
			stats,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	} catch {
		return null;
	}
}
async function getNflPlayerStats(athleteId, name, team) {
	return getEspnAthleteStats({
		league: "NFL",
		sportPath: "football/nfl",
		categoryName: "passing",
		wantedLabels: [
			"CMP",
			"ATT",
			"YDS",
			"TD",
			"INT",
			"RTG"
		]
	}, athleteId, name, team);
}
// src/lib/sports/aggregate.ts
var FETCH_TIMEOUT_MS = 8e3;
var scoreboardCache = null;
var playersCache = null;
async function getScoreboard() {
	if (scoreboardCache && scoreboardCache.expires > Date.now()) return scoreboardCache.data;
	const jobs = [
		...MLB_TEAMS.map((t) => withTimeout(getMlbTeamGames(t.id, t.name), FETCH_TIMEOUT_MS, [])),
		...NHL_TEAMS.map((t) => withTimeout(getNhlTeamGames(t.abbrev, t.name), FETCH_TIMEOUT_MS, [])),
		...NFL_TEAMS.map((t) => withTimeout(getEspnTeamGames("NFL", t.id, t.name), FETCH_TIMEOUT_MS, [])),
		...CFB_TEAMS.map((t) => withTimeout(getEspnTeamGames("CFB", t.id, t.name), FETCH_TIMEOUT_MS, [])),
		...CBB_TEAMS.map((t) => withTimeout(getEspnTeamGames("CBB", t.id, t.name), FETCH_TIMEOUT_MS, []))
	];
	const allGames = (await Promise.all(jobs)).flat();
	const now = Date.now();
	const live = allGames.filter((g) => g.status === "live");
	const scoreboard = {
		live,
		upcoming: allGames.filter((g) => g.status === "scheduled" && new Date(g.startTimeUTC).getTime() >= now).sort((a, b) => new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime()),
		recent: allGames.filter((g) => g.status === "final").sort((a, b) => new Date(b.startTimeUTC).getTime() - new Date(a.startTimeUTC).getTime()).slice(0, 8),
		hasLive: live.length > 0,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	scoreboardCache = {
		data: scoreboard,
		expires: Date.now() + (scoreboard.hasLive ? 2e4 : 12e4)
	};
	return scoreboard;
}
async function getPlayers() {
	if (playersCache && playersCache.expires > Date.now()) return playersCache.data;
	const jobs = [
		...MLB_PLAYERS.map((p) => withTimeout(getMlbPlayerStats(p.id, p.name, p.team), FETCH_TIMEOUT_MS, null)),
		...NHL_PLAYERS.map((p) => withTimeout(getNhlPlayerStats(p.id, p.name, p.team), FETCH_TIMEOUT_MS, null)),
		...NFL_PLAYERS.map((p) => withTimeout(getNflPlayerStats(p.id, p.name, p.team), FETCH_TIMEOUT_MS, null))
	];
	const payload = {
		players: (await Promise.all(jobs)).filter((p) => p !== null),
		generatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	playersCache = {
		data: payload,
		expires: Date.now() + 6e5
	};
	return payload;
}
export { TEAM_LOGOS as i, getScoreboard as n, DISPLAY_TEAMS as r, getPlayers as t };
