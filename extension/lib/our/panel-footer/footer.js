import { LINKEDIN } from "../../icons/index.js";
import { MD2IT } from "../icons.js";
import { PANEL_FOOTER_LINKEDIN_URL, PANEL_FOOTER_MD2IT_URL } from "./constants.js";

var PANEL_FOOTER_LINKS = [
  { href: PANEL_FOOTER_LINKEDIN_URL, title: "LinkedIn", iconHtml: LINKEDIN },
  { href: PANEL_FOOTER_MD2IT_URL, title: "MD2IT", iconHtml: MD2IT }
];

function createFooterLink(link) {
  const anchor = document.createElement("a");
  anchor.href = link.href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.title = link.title;
  anchor.innerHTML = link.iconHtml;
  return anchor;
}

function attachPanelFooterLinks(footer) {
  for (const anchor of Array.from(
    footer.querySelectorAll("a[href]")
  )) {
    anchor.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

function createPanelFooter(config) {
  const footer = document.createElement("div");
  footer.className = config.footerClassName;
  for (const link of PANEL_FOOTER_LINKS) {
    footer.appendChild(createFooterLink(link));
  }
  attachPanelFooterLinks(footer);
  return footer;
}

export { PANEL_FOOTER_LINKS, attachPanelFooterLinks, createFooterLink, createPanelFooter };
