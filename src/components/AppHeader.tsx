import type { ReactNode } from "react";
import "@/styles/header.css";

/** The scales mark from favicon.svg, drawn in currentColor so it follows the header accent. */
function ScalesMark() {
  return (
    <svg className="app-header__mark" viewBox="0 0 256 256" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <line x1="128" y1="40" x2="128" y2="216" />
        <line x1="104" y1="216" x2="152" y2="216" />
        <line x1="56" y1="88" x2="200" y2="56" />
        <path d="M24,168c0,17.67,20,24,32,24s32-6.33,32-24L56,88Z" />
        <path d="M168,136c0,17.67,20,24,32,24s32-6.33,32-24L200,56Z" />
      </g>
    </svg>
  );
}

/**
 * AppHeader — Decision Lab's own sticky header: scales mark + tool name on the
 * left, page controls (theme toggle, etc.) on the right. Colors come from the
 * surface and accent tokens in tokens.css, which flip with the data-theme
 * attribute ThemeProvider sets on <html>.
 */
export default function AppHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="app-header">
      <div className="app-header__title">
        <ScalesMark />
        <h1 className="app-header__name">Decision Lab</h1>
      </div>
      <div className="app-header__actions">{actions}</div>
    </header>
  );
}
