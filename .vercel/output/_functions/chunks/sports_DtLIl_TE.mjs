import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { b as renderHead, d as renderComponent, k as unescapeHTML, v as renderTemplate, x as addAttribute } from "./jsx-runtime_BMuUvdE9.mjs";
import { u as createComponent } from "./consts_BSo1ptb7.mjs";
import "./_astro_assets_BLdNWVoJ.mjs";
import { t as renderScript } from "./script_j7dFxQlt.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_BIpcp03b.mjs";
import { n as SITE_TITLE } from "./consts_D8s3bis-.mjs";
import { i as TEAM_LOGOS, n as getScoreboard, r as DISPLAY_TEAMS, t as getPlayers } from "./aggregate_Fwhxr7F3.mjs";
// src/pages/sports.astro
var sports_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Sports,
	file: () => $$file,
	url: () => $$url
});
var $$Sports = createComponent(async ($$result, $$props, $$slots) => {
	const [scoreboard, players] = await Promise.all([getScoreboard(), getPlayers()]);
	const initialData = {
		scoreboard,
		players
	};
	return renderTemplate`<html lang="en"><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": `Sports | ${SITE_TITLE}`,
		"description": "Ron's teams and players, live."
	})}${renderHead($$result)}</head><body>${renderComponent($$result, "Header", $$Header, {})}<main><div class="page-header"><h1>Sports</h1><p>Games and players I follow — updated live.</p><div class="team-logos">${DISPLAY_TEAMS.map((t) => renderTemplate`<img${addAttribute(TEAM_LOGOS[t], "src")}${addAttribute(t, "alt")}${addAttribute(t, "title")} loading="lazy">`)}</div></div><div class="filters" id="team-filters"><button class="filter-pill active" data-team="all">All</button>${DISPLAY_TEAMS.map((t) => renderTemplate`<button class="filter-pill active"${addAttribute(t, "data-team")}>${t}</button>`)}</div><section class="block" id="live-block"><p class="section-title">Live Now</p><div id="live-container"></div></section><section class="block"><p class="section-title">Upcoming Games</p><div id="upcoming-container"></div></section><section class="block"><p class="section-title">Recent Results</p><div id="recent-container"></div></section><section class="block"><p class="section-title">Favorite Players</p><div id="players-container" class="cards-grid"></div></section></main>${renderComponent($$result, "Footer", $$Footer, {})}<script type="application/json" id="sports-initial-data">${unescapeHTML(JSON.stringify(initialData))}<\/script>${renderScript($$result, "/home/rjacobs/Documents/astro/src/pages/sports.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/rjacobs/Documents/astro/src/pages/sports.astro", void 0);
var $$file = "/home/rjacobs/Documents/astro/src/pages/sports.astro";
var $$url = "/sports";
// \0virtual:astro:page:src/pages/sports@_@astro
var page = () => sports_exports;
export { page };
