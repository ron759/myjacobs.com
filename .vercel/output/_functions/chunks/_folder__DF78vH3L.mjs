import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { b as renderHead, d as renderComponent, v as renderTemplate, x as addAttribute } from "./jsx-runtime_BMuUvdE9.mjs";
import { u as createComponent } from "./consts_BSo1ptb7.mjs";
import { i as createAstro } from "./_astro_assets_BLdNWVoJ.mjs";
import { t as renderScript } from "./script_j7dFxQlt.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_BIpcp03b.mjs";
import { n as SITE_TITLE } from "./consts_D8s3bis-.mjs";
import { i as thumbUrl, r as getPhotos, t as fullUrl } from "./cloudinary_BBn9-aTZ.mjs";
// src/pages/gallery/[folder].astro
var _folder__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Folder,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://myjacobs.com");
var $$Folder = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Folder;
	const { folder } = Astro.params;
	if (!folder) return Astro.redirect("/gallery");
	const dashIndex = folder.indexOf("-");
	const year = dashIndex > -1 ? folder.slice(0, dashIndex) : "";
	const name = dashIndex > -1 ? folder.slice(dashIndex + 1).replace(/-/g, " ") : folder;
	const { photos, error } = await getPhotos(folder);
	return renderTemplate`<html lang="en" data-astro-cid-v4uox7k7><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": `${name} ${year} | Gallery | ${SITE_TITLE}`,
		"description": `Photos from ${name} ${year}`,
		"data-astro-cid-v4uox7k7": true
	})}${renderHead($$result)}</head><body data-astro-cid-v4uox7k7>${renderComponent($$result, "Header", $$Header, { "data-astro-cid-v4uox7k7": true })}<main data-astro-cid-v4uox7k7><div class="page-header" data-astro-cid-v4uox7k7><div data-astro-cid-v4uox7k7><a class="back-link" href="/gallery" data-astro-cid-v4uox7k7>← All Albums</a></div>${year && renderTemplate`<div class="year-label" data-astro-cid-v4uox7k7>${year}</div>`}<h1 data-astro-cid-v4uox7k7>${name}</h1>${!error && renderTemplate`<p class="photo-count" data-astro-cid-v4uox7k7>${photos.length} ${photos.length === 1 ? "photo" : "photos"}</p>`}</div><div class="gallery-grid" data-astro-cid-v4uox7k7>${error ? renderTemplate`<div class="empty-state" data-astro-cid-v4uox7k7><p data-astro-cid-v4uox7k7>Could not load photos: <code data-astro-cid-v4uox7k7>${error}</code></p></div>` : photos.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-v4uox7k7><p data-astro-cid-v4uox7k7>No photos in this album yet.</p></div>` : photos.map((photo, i) => {
		const thumb = thumbUrl(photo.src);
		const full = fullUrl(photo.src);
		return renderTemplate`<div class="photo-card"${addAttribute(full, "data-full")}${addAttribute(photo.caption, "data-caption")} data-astro-cid-v4uox7k7><img${addAttribute(thumb, "src")}${addAttribute(photo.caption || `Photo ${i + 1}`, "alt")} loading="lazy"${addAttribute(600, "width")}${addAttribute(440, "height")} data-astro-cid-v4uox7k7>${photo.caption && renderTemplate`<div class="caption" data-astro-cid-v4uox7k7>${photo.caption}</div>`}</div>`;
	})}</div></main><!-- Lightbox --><div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" data-astro-cid-v4uox7k7><button class="lightbox-close" id="lightbox-close" aria-label="Close" data-astro-cid-v4uox7k7>&times;</button><img id="lightbox-img" src="" alt="" data-astro-cid-v4uox7k7><div class="lightbox-caption" id="lightbox-caption" data-astro-cid-v4uox7k7></div></div>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-v4uox7k7": true })}${renderScript($$result, "/home/rjacobs/Documents/astro/src/pages/gallery/[folder].astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/rjacobs/Documents/astro/src/pages/gallery/[folder].astro", void 0);
var $$file = "/home/rjacobs/Documents/astro/src/pages/gallery/[folder].astro";
var $$url = "/gallery/[folder]";
// \0virtual:astro:page:src/pages/gallery/[folder]@_@astro
var page = () => _folder__exports;
export { page };
