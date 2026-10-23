import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { b as renderHead, d as renderComponent, v as renderTemplate, x as addAttribute } from "./jsx-runtime_BMuUvdE9.mjs";
import { u as createComponent } from "./consts_BSo1ptb7.mjs";
import "./_astro_assets_BLdNWVoJ.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_BIpcp03b.mjs";
import { n as SITE_TITLE, t as SITE_DESCRIPTION } from "./consts_D8s3bis-.mjs";
import { t as $$FormattedDate } from "./FormattedDate_NBFTn5Ed.mjs";
import { t as getCollection } from "./_astro_content_DttD_IJA.mjs";
// src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const posts = (await getCollection("blog")).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, 3);
	return renderTemplate`<html lang="en" data-astro-cid-lcdefpme><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": SITE_TITLE,
		"description": SITE_DESCRIPTION,
		"data-astro-cid-lcdefpme": true
	})}${renderHead($$result)}</head><body data-astro-cid-lcdefpme>${renderComponent($$result, "Header", $$Header, { "data-astro-cid-lcdefpme": true })}<main data-astro-cid-lcdefpme><!-- Hero photo --><div class="hero-photo" data-astro-cid-lcdefpme><img src="/family-mural.jpg" alt="The Jacobs Family mural" data-astro-cid-lcdefpme></div><!-- Hero info band --><div class="hero-info" data-astro-cid-lcdefpme><p class="tagline" data-astro-cid-lcdefpme>Love God. Love Family. Love People.</p><p class="intro" data-astro-cid-lcdefpme>Hey, we're Ron and Vanessa — married, based in Middle Tennessee, and navigating life together with 2 grown boys, 2 daughter-in-laws, 4 grandkids, and 3 dogs who run the house. We're both IT people by trade, and Vanessa turned our love of travel into a side business helping others plan their adventures. This is our little corner of the internet — family updates, photos, and whatever's on our minds.</p><div class="stats" data-astro-cid-lcdefpme><div class="stat" data-astro-cid-lcdefpme><span class="number" data-astro-cid-lcdefpme>2</span><span class="label" data-astro-cid-lcdefpme>Kids</span></div><div class="stat" data-astro-cid-lcdefpme><span class="number" data-astro-cid-lcdefpme>2</span><span class="label" data-astro-cid-lcdefpme>daughter-in-laws</span></div><div class="stat" data-astro-cid-lcdefpme><span class="number" data-astro-cid-lcdefpme>4</span><span class="label" data-astro-cid-lcdefpme>Grandkids</span></div><div class="stat" data-astro-cid-lcdefpme><span class="number" data-astro-cid-lcdefpme>3</span><span class="label" data-astro-cid-lcdefpme>Dogs</span></div></div></div><!-- Two column: posts + gallery CTA --><div class="content-grid" data-astro-cid-lcdefpme><!-- Latest Blog Posts --><section class="posts-section" data-astro-cid-lcdefpme><p class="section-title" data-astro-cid-lcdefpme>Latest Posts</p><p class="section-subtitle" data-astro-cid-lcdefpme>What's been on our minds lately.</p>${posts.length === 0 ? renderTemplate`<p style="color: rgb(var(--gray)); font-size: 0.9em;" data-astro-cid-lcdefpme>No posts yet — check back soon.</p>` : renderTemplate`<ul class="post-list" data-astro-cid-lcdefpme>${posts.map((post) => renderTemplate`<li data-astro-cid-lcdefpme><a${addAttribute(`/blog/${post.id}/`, "href")} data-astro-cid-lcdefpme><span class="post-title" data-astro-cid-lcdefpme>${post.data.title}</span><span class="post-date" data-astro-cid-lcdefpme>${renderComponent($$result, "FormattedDate", $$FormattedDate, {
		"date": post.data.pubDate,
		"data-astro-cid-lcdefpme": true
	})}</span></a></li>`)}</ul>`}<a href="/blog" class="view-all" data-astro-cid-lcdefpme>All posts →</a></section><!-- Gallery CTA --><div class="gallery-cta" data-astro-cid-lcdefpme><h2 data-astro-cid-lcdefpme>📷 Photo Gallery</h2><p data-astro-cid-lcdefpme>Family trips, everyday moments, and everything in between. Drop in and take a look.</p><a href="/gallery" class="btn" data-astro-cid-lcdefpme>Browse Photos</a></div></div></main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-lcdefpme": true })}</body></html>`;
}, "/home/rjacobs/Documents/astro/src/pages/index.astro", void 0);
var $$file = "/home/rjacobs/Documents/astro/src/pages/index.astro";
// \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
export { page };
