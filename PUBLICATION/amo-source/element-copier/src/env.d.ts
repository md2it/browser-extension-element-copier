declare const process: {
  env: {
    PANEL_CSS_CONTENT: string;
    PANEL_HEADER_CSS: string;
    PICK_CSS_CONTENT: string;
  };
};

declare const browser: typeof chrome | undefined;

declare module "*.svg" {
  const content: string;
  export default content;
}
