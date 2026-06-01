// src/lib/cloudinary.ts
// Shared Cloudinary API helpers — import these in any page that needs photos.

const CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
const API_KEY    = import.meta.env.CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.CLOUDINARY_API_SECRET;
const ROOT       = 'jacobs-family'; // top-level Cloudinary folder

export type Photo = {
	src: string;
	caption: string;
};

export type Album = {
	folder: string;   // e.g. "2026-Bahamas"
	year: string;     // e.g. "2026"
	name: string;     // e.g. "Bahamas"
	cover: string;    // optimized cover image URL
	count: number;
};

function credentials() {
	return btoa(`${API_KEY}:${API_SECRET}`);
}

function thumbUrl(src: string) {
	return src.replace('/upload/', '/upload/f_auto,q_auto,w_600,h_440,c_fill/');
}

function fullUrl(src: string) {
	return src.replace('/upload/', '/upload/f_auto,q_auto,w_1600/');
}

/** Check env vars are present */
export function cloudinaryConfigured() {
	return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

/**
 * Fetch all subfolders of ROOT (e.g. jacobs-family/2026-Bahamas)
 * and the first photo from each to use as a cover.
 */
export async function getAlbums(): Promise<{ albums: Album[]; error: string }> {
	if (!cloudinaryConfigured()) return { albums: [], error: 'Cloudinary env vars are not set.' };

	try {
		// 1. Get subfolders
		const foldersRes = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${ROOT}`,
			{ headers: { Authorization: `Basic ${credentials()}` } }
		);
		if (!foldersRes.ok) throw new Error(`Folders API error: ${foldersRes.status}`);
		const foldersData = await foldersRes.json() as {
			folders: Array<{ name: string; path: string }>;
		};

		const folders = foldersData.folders ?? [];

		// 2. For each folder, grab the first photo as cover
		const albums: Album[] = await Promise.all(
			folders.map(async (f) => {
				// folder name is like "2026-Bahamas" — split on first hyphen
				const dashIndex = f.name.indexOf('-');
				const year = dashIndex > -1 ? f.name.slice(0, dashIndex) : f.name;
				const name = dashIndex > -1 ? f.name.slice(dashIndex + 1).replace(/-/g, ' ') : f.name;

				// fetch just one photo for the cover
				const coverRes = await fetch(
					`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&asset_folder=${encodeURIComponent(f.path)}&max_results=1`,
					{ headers: { Authorization: `Basic ${credentials()}` } }
				);
				const coverData = await coverRes.json() as {
					resources: Array<{ secure_url: string }>;
				};
				const coverSrc = coverData.resources.length > 0 ? coverData.resources[0].secure_url : '';

				// fetch count
				const countRes = await fetch(
					`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&asset_folder=${encodeURIComponent(f.path)}&max_results=500`,
					{ headers: { Authorization: `Basic ${credentials()}` } }
				);
				const countData = await countRes.json() as { resources: Array<unknown> };

				return {
					folder: f.name,
					year,
					name,
					cover: coverSrc ? thumbUrl(coverSrc) : '',
					count: countData.resources.length,
				};
			})
		);

		// Sort newest year first, then alphabetically by name
		const filteredAlbums = albums.filter(a => a.count > 0);
		filteredAlbums.sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name));
		return { albums: filteredAlbums, error: '' };

	} catch (e) {
		return { albums: [], error: e instanceof Error ? e.message : 'Unknown error.' };
	}
}

/**
 * Fetch all photos in a specific subfolder (e.g. "2026-Bahamas")
 */
export async function getPhotos(folder: string): Promise<{ photos: Photo[]; error: string }> {
	if (!cloudinaryConfigured()) return { photos: [], error: 'Cloudinary env vars are not set.' };

	try {
		const path = `${ROOT}/${folder}`;
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&asset_folder=${encodeURIComponent(path)}&max_results=500&context=true`,
			{ headers: { Authorization: `Basic ${credentials()}` } }
		);
		if (!res.ok) throw new Error(`Cloudinary API error: ${res.status}`);

		const data = await res.json() as {
			resources: Array<{
				secure_url: string;
				context?: { custom?: { caption?: string; alt?: string } };
			}>;
		};

		const photos: Photo[] = data.resources.map((r) => ({
			src: r.secure_url,
			thumb: thumbUrl(r.secure_url),
			full: fullUrl(r.secure_url),
			caption: r.context?.custom?.caption ?? r.context?.custom?.alt ?? '',
		}));

		return { photos, error: '' };
	} catch (e) {
		return { photos: [], error: e instanceof Error ? e.message : 'Unknown error.' };
	}
}

export { thumbUrl, fullUrl };
