import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as getPlayers } from "./aggregate_Fwhxr7F3.mjs";
// src/pages/api/sports/players.json.ts
var players_json_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async () => {
	const data = await getPlayers();
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
};
// \0virtual:astro:page:src/pages/api/sports/players.json@_@ts
var page = () => players_json_exports;
export { page };
