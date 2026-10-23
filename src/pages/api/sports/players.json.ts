import type { APIRoute } from 'astro';
import { getPlayers } from '../../../lib/sports/aggregate';

export const GET: APIRoute = async () => {
	const data = await getPlayers();
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
};
