import { md2it_default } from "../icons/md2it.js";

function stripComment2(svg) {
  return svg.replace(/<!--[\s\S]*?-->\s*/g, "").trim();
}

function inlineSvg(raw) {
  return stripComment2(raw).replace(/fill="#000000"/g, 'fill="currentColor"');
}

var MD2IT = inlineSvg(md2it_default);

export { MD2IT, inlineSvg, stripComment2 };
