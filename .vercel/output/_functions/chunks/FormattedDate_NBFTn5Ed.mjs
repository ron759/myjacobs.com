import { v as renderTemplate, x as addAttribute, y as maybeRenderHead } from "./jsx-runtime_BMuUvdE9.mjs";
import { u as createComponent } from "./consts_BSo1ptb7.mjs";
import { i as createAstro } from "./_astro_assets_BLdNWVoJ.mjs";
// src/components/FormattedDate.astro
createAstro("https://myjacobs.com");
var $$FormattedDate = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FormattedDate;
	const { date } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<time${addAttribute(date.toISOString(), "datetime")}>${date.toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric"
	})}</time>`;
}, "/home/rjacobs/Documents/astro/src/components/FormattedDate.astro", void 0);
export { $$FormattedDate as t };
