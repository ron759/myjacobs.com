import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { b as renderHead, d as renderComponent, v as renderTemplate, x as addAttribute } from "./jsx-runtime_BMuUvdE9.mjs";
import { u as createComponent } from "./consts_BSo1ptb7.mjs";
import "./_astro_assets_BLdNWVoJ.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_BIpcp03b.mjs";
import { n as SITE_TITLE } from "./consts_D8s3bis-.mjs";
import { t as $$FormattedDate } from "./FormattedDate_NBFTn5Ed.mjs";
import { t as getCollection } from "./_astro_content_DttD_IJA.mjs";
// src/pages/blog/index.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const posts = (await getCollection("blog")).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	return renderTemplate`<html lang="en"><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": `Blog | ${SITE_TITLE}`,
		"description": "All posts from The Jacobs Family."
	})}${renderHead($$result)}</head><body>${renderComponent($$result, "Header", $$Header, {})}<main><div class="page-header"><h1>The Blog</h1><p>Family updates, travel notes, and whatever's on our minds.</p></div>${posts.length === 0 ? renderTemplate`<div class="empty-state"><p>No posts yet — check back soon.</p></div>` : renderTemplate`<ul class="post-list">${posts.map((post) => renderTemplate`<li><a${addAttribute(`/blog/${post.id}/`, "href")}><span class="post-title">${post.data.title}</span><div class="post-meta"><span class="post-date">${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": post.data.pubDate })}</span></div></a></li>`)}</ul>`}</main>${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "/home/rjacobs/Documents/astro/src/pages/blog/index.astro", void 0);
var $$file = "/home/rjacobs/Documents/astro/src/pages/blog/index.astro";
var $$url = "/blog";
// \0virtual:astro:page:src/pages/blog/index@_@astro
var page = () => blog_exports;
export { page };
