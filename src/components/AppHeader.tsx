import type { ReactNode } from "react";
import { Button, Tooltip } from "antd";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import "@/styles/header.css";

/**
 * AppHeader: the sticky header lockup. Left to right: the nav toggle, the
 * mark in a colored tile, the tool name in the display face; page-level
 * controls (theme toggle, etc.) on the right.
 *
 * Built to be copied into the other DeeBuilt tools: an app swaps `mark`,
 * `name` and the tile color (--ops-header-tile-bg) and keeps everything else.
 * See docs/DECISION_LAB_UPGRADE.md, "Carrying it to the other tools".
 */
export default function AppHeader({
  mark,
  name,
  actions,
  onToggleNav,
  navLabel,
}: {
  /** An icon drawn in currentColor; it renders white on the tile. */
  mark: ReactNode;
  name: string;
  actions?: ReactNode;
  /** Opens or collapses the app's nav. Omit in an app with no nav. */
  onToggleNav?: () => void;
  /** The toggle's accessible name, which changes with the nav's state. */
  navLabel?: string;
}) {
  return (
    <header className="app-header">
      <div className="app-header__lead">
        {onToggleNav && (
          <Tooltip title={navLabel} placement="bottomLeft">
            <Button
              type="text"
              aria-label={navLabel}
              icon={<SidebarSimpleIcon />}
              onClick={onToggleNav}
              className="app-header__btn"
            />
          </Tooltip>
        )}
        <div className="app-header__lockup">
          <span className="app-header__tile" aria-hidden="true">
            {mark}
          </span>
          <h1 className="app-header__name">{name}</h1>
        </div>
      </div>
      <div className="app-header__actions">{actions}</div>
    </header>
  );
}
