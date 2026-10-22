import { Dropdown, Tooltip } from "antd";
import {
  HouseIcon,
  CompassIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import DeeBuiltCredit from "@/components/DeeBuiltCredit";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  /** An exact match only — otherwise "/" would light up on every route. */
  end?: boolean;
}

// Icons render at 1em; .dl-nav-icon sizes them from --ops-icon-nav.
const ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: <HouseIcon />, end: true },
  { to: "/platform-picker", label: "Platform Picker", icon: <CompassIcon /> },
];

/**
 * The left rail. Collapsible on desktop (icon-only), and rendered uncollapsed
 * inside a Drawer on mobile. The collapse toggle lives in the header.
 *
 * The rail's foot carries the DeeBuilt credit and the About / Privacy links,
 * so on desktop the page has one bottom edge instead of a footer that can't
 * line up with the rail. Collapsed, the foot shrinks to an info menu.
 *
 * Widths and colors come from tokens.css; nothing here is a magic number.
 */
export function SideNav({
  collapsed,
  onNavigate,
  onAbout,
  onPrivacy,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onAbout: () => void;
  onPrivacy: () => void;
}) {
  return (
    <nav className="dl-nav" data-collapsed={collapsed} aria-label="Sections">
      <ul className="dl-nav-list">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <Tooltip title={collapsed ? item.label : undefined} placement="right">
              <NavLink
                to={item.to}
                end={item.end}
                className="dl-nav-item"
                onClick={onNavigate}
              >
                <span className="dl-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {/* Kept in the DOM when collapsed rather than unmounted, so the
                    label is still the accessible name of the link. CSS clips it. */}
                <span className="dl-nav-label">{item.label}</span>
              </NavLink>
            </Tooltip>
          </li>
        ))}
      </ul>

      <div className="dl-nav-foot">
        {collapsed ? (
          <Dropdown
            trigger={["click"]}
            placement="topLeft"
            menu={{
              items: [
                { key: "about", label: "About", onClick: onAbout },
                { key: "privacy", label: "Privacy", onClick: onPrivacy },
                { type: "divider" },
                {
                  key: "credit",
                  label: (
                    <a href="https://deebuilt.co" target="_blank" rel="noopener noreferrer">
                      Made by DeeBuilt
                    </a>
                  ),
                },
              ],
            }}
          >
            <button type="button" className="dl-nav-item" aria-label="About Decision Lab">
              <span className="dl-nav-icon" aria-hidden="true">
                <InfoIcon />
              </span>
            </button>
          </Dropdown>
        ) : (
          <>
            <DeeBuiltCredit />
            <div className="dl-nav-foot-links">
              <button type="button" className="dl-nav-foot-link" onClick={onAbout}>
                About
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" className="dl-nav-foot-link" onClick={onPrivacy}>
                Privacy
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
