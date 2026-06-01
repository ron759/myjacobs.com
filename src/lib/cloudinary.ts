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

type CloudinaryResource = {
	secure_url: string;
	asset_folder: string;
	context?: { custom?: { caption?: string; alt?: string } };
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
 * Fetch ALL images under ROOT in one call, then group by asset_folder client-side.
 * This works around Cloudinary's unreliable asset_folder filter parameter.
 */
async function fetchAllResources(): Promise<CloudinaryResource[]> {
	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&max_results=500&context=true`,
		{ headers: { Authorization: `Basic ${credentials()}` } }
	);
	if (!res.ok) throw new Error(`Cloudinary API error: ${res.status}`);
	const data = await res.json() as { resources: CloudinaryResource[] };
	return data.resources ?? [];
}

/**
 * Fetch all subfolders of ROOT and build album list from actual resource data.
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

		// 2. Fetch all resources once and filter client-side
		const allResources = await fetchAllResources();

		// 3. Build albums
		const albums: Album[] = folders.map((f) => {
			const dashIndex = f.name.indexOf('-');
			const year = dashIndex > -1 ? f.name.slice(0, dashIndex) : f.name;
			const name = dashIndex > -1 ? f.name.slice(dashIndex + 1).replace(/-/g, ' ') : f.name;

			// Filter resources that actually belong to this folder
			const folderResources = allResources.filter(r => r.asset_folder === f.path);

			const coverSrc = folderResources[0]?.secure_url ?? '';

			return {
				folder: f.name,
				year,
				name,
				cover: coverSrc ? thumbUrl(coverSrc) : '',
				count: folderResources.length,
			};
		});

		// Hide empty folders, then sort newest year first, then alphabetically
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

		// Fetch all resources and filter client-side by asset_folder
		const allResources = await fetchAllResources();
		const folderResources = allResources.filter(r => r.asset_folder === path);

		const photos: Photo[] = folderResources.map((r) => ({
			src: r.secure_url,
			caption: r.context?.custom?.caption ?? r.context?.custom?.alt ?? '',
		}));

		return { photos, error: '' };
	} catch (e) {
		return { photos: [], error: e instanceof Error ? e.message : 'Unknown error.' };
	}
}

export { thumbUrl, fullUrl };
