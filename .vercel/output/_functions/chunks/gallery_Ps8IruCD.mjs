import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { b as renderHead, d as renderComponent, v as renderTemplate, x as addAttribute } from "./jsx-runtime_BMuUvdE9.mjs";
import { u as createComponent } from "./consts_BSo1ptb7.mjs";
import "./_astro_assets_BLdNWVoJ.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_BIpcp03b.mjs";
import { n as SITE_TITLE } from "./consts_D8s3bis-.mjs";
import { n as getAlbums } from "./cloudinary_BBn9-aTZ.mjs";
// src/pages/gallery.astro
var gallery_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Gallery,
	file: () => $$file,
	url: () => $$url
});
var $$Gallery = createComponent(async ($$result, $$props, $$slots) => {
	const { albums, error } = await getAlbums();
	return renderTemplate`<html lang="en" data-astro-cid-3mhbem3k><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": `Gallery | ${SITE_TITLE}`,
		"description": "Family photo albums",
		"data-astro-cid-3mhbem3k": true
	})}${renderHead($$result)}</head><body data-astro-cid-3mhbem3k>${renderComponent($$result, "Header", $$Header, { "data-astro-cid-3mhbem3k": true })}<main data-astro-cid-3mhbem3k><div class="page-header" data-astro-cid-3mhbem3k><h1 data-astro-cid-3mhbem3k>Gallery</h1><p data-astro-cid-3mhbem3k>Photos worth keeping.</p></div><div class="albums-grid" data-astro-cid-3mhbem3k>${error ? renderTemplate`<div class="empty-state" data-astro-cid-3mhbem3k><p data-astro-cid-3mhbem3k>Could not load albums: <code data-astro-cid-3mhbem3k>${error}</code></p></div>` : albums.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-3mhbem3k><p data-astro-cid-3mhbem3k>No albums yet — create subfolders inside <code data-astro-cid-3mhbem3k>jacobs-family</code> in Cloudinary named like <code data-astro-cid-3mhbem3k>2026-Bahamas</code> and upload photos into them.</p></div>` : albums.map((album) => renderTemplate`<a class="album-card"${addAttribute(`/gallery/${album.folder}`, "href")} data-astro-cid-3mhbem3k>${album.cover ? renderTemplate`<img class="album-cover"${addAttribute(album.cover, "src")}${addAttribute(`${album.name} cover photo`, "alt")} loading="lazy"${addAttribute(600, "width")}${addAttribute(440, "height")} data-astro-cid-3mhbem3k>` : renderTemplate`<div class="album-cover-placeholder" data-astro-cid-3mhbem3k>📷</div>`}<div class="album-info" data-astro-cid-3mhbem3k><div class="album-year" data-astro-cid-3mhbem3k>${album.year}</div><div class="album-name" data-astro-cid-3mhbem3k>${album.name}</div><div class="album-count" data-astro-cid-3mhbem3k>${album.count} ${album.count === 1 ? "photo" : "photos"}</div></div></a>`)}</div></main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-3mhbem3k": true })}</body></html>`;
}, "/home/rjacobs/Documents/astro/src/pages/gallery.astro", void 0);
var $$file = "/home/rjacobs/Documents/astro/src/pages/gallery.astro";
var $$url = "/gallery";
// \0virtual:astro:page:src/pages/gallery@_@astro
var page = () => gallery_exports;
export { page };
