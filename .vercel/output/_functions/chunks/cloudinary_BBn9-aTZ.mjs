// src/lib/cloudinary.ts
var CLOUD_NAME = "da1xcpp6s";
var API_KEY = "231724574687191";
var API_SECRET = "ONqEkebDN1gIFkL1Rg1D-lO09qQ";
var ROOT = "jacobs-family";
function credentials() {
	return btoa(`${API_KEY}:${API_SECRET}`);
}
function thumbUrl(src) {
	return src.replace("/upload/", "/upload/f_auto,q_auto,w_600,h_440,c_fill/");
}
function fullUrl(src) {
	return src.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
}
/** Check env vars are present */
function cloudinaryConfigured() {
	return true;
}
/**
* Fetch ALL images under ROOT in one call, then group by asset_folder client-side.
* This works around Cloudinary's unreliable asset_folder filter parameter.
*/
async function fetchAllResources() {
	const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&max_results=500&context=true`, { headers: { Authorization: `Basic ${credentials()}` } });
	if (!res.ok) throw new Error(`Cloudinary API error: ${res.status}`);
	return (await res.json()).resources ?? [];
}
/**
* Fetch all subfolders of ROOT and build album list from actual resource data.
*/
async function getAlbums() {
	if (!cloudinaryConfigured()) return {
		albums: [],
		error: "Cloudinary env vars are not set."
	};
	try {
		const foldersRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${ROOT}`, { headers: { Authorization: `Basic ${credentials()}` } });
		if (!foldersRes.ok) throw new Error(`Folders API error: ${foldersRes.status}`);
		const folders = (await foldersRes.json()).folders ?? [];
		const allResources = await fetchAllResources();
		const filteredAlbums = folders.map((f) => {
			const dashIndex = f.name.indexOf("-");
			const year = dashIndex > -1 ? f.name.slice(0, dashIndex) : f.name;
			const name = dashIndex > -1 ? f.name.slice(dashIndex + 1).replace(/-/g, " ") : f.name;
			const folderResources = allResources.filter((r) => r.asset_folder === f.path);
			const coverSrc = folderResources[0]?.secure_url ?? "";
			return {
				folder: f.name,
				year,
				name,
				cover: coverSrc ? thumbUrl(coverSrc) : "",
				count: folderResources.length
			};
		}).filter((a) => a.count > 0);
		filteredAlbums.sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name));
		return {
			albums: filteredAlbums,
			error: ""
		};
	} catch (e) {
		return {
			albums: [],
			error: e instanceof Error ? e.message : "Unknown error."
		};
	}
}
/**
* Fetch all photos in a specific subfolder (e.g. "2026-Bahamas")
*/
async function getPhotos(folder) {
	if (!cloudinaryConfigured()) return {
		photos: [],
		error: "Cloudinary env vars are not set."
	};
	try {
		const path = `${ROOT}/${folder}`;
		return {
			photos: (await fetchAllResources()).filter((r) => r.asset_folder === path).map((r) => ({
				src: r.secure_url,
				caption: r.context?.custom?.caption ?? r.context?.custom?.alt ?? ""
			})),
			error: ""
		};
	} catch (e) {
		return {
			photos: [],
			error: e instanceof Error ? e.message : "Unknown error."
		};
	}
}
export { thumbUrl as i, getAlbums as n, getPhotos as r, fullUrl as t };
