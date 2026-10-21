import type { PlatformCode } from "./platforms";
import smartsheetLogo from "./logos/smartsheet.png";
import teamworkIcon from "./logos/teamwork-icon.png";

/**
 * Logo marks for the Home card's app tiles.
 *
 * Two kinds:
 *   · `path`: a one-color mark, drawn white on the platform's brand color
 *     (colors live in picker-card.css as --pp-brand-<code>).
 *   · `shapes`: a multicolor mark in its own colors, on a white tile, the way
 *     the platform's own app icon looks.
 *   · `image`: a PNG for marks only available as pixels. `fillsTile` means
 *     the image is already a whole app icon and covers the tile; otherwise it
 *     sits on white with padding.
 * A platform with none of these shows `letter` until its file is added.
 *
 * Sources: Airtable, Asana, ClickUp are Simple Icons paths (CC0 SVG data).
 * SmartSuite is the mark from deebuilt-foundations/public/smartsuite-logo.svg.
 * monday.com is the mark from Wikipedia's "Monday logo.svg". Smartsheet and
 * Teamwork.com are PNGs Ruthnie downloaded into ./logos (teamwork-icon.png is
 * teamwork.png cropped to the icon). Every mark stays its owner's trademark.
 */
export interface MarkShape {
  /** SVG path data; or `ellipse` for a dot. */
  d?: string;
  ellipse?: { cx: number; cy: number; rx: number; ry: number };
  fill: string;
}

export interface PlatformMark {
  /** viewBox for `path` or `shapes`. Simple Icons are 24x24. */
  viewBox?: string;
  path?: string;
  shapes?: MarkShape[];
  image?: string;
  fillsTile?: boolean;
  letter: string;
}

export const MARKS: Record<PlatformCode, PlatformMark> = {
  AT: {
    letter: "A",
    viewBox: "0 0 24 24",
    path: "M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z",
  },
  ASA: {
    letter: "A",
    viewBox: "0 0 24 24",
    path: "M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.34 5.22-5.22-2.336-5.22-5.22-5.22zm-13.56 0c-2.88 0-5.22 2.337-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.336-5.22-5.22-5.22zm12-6.525c0 2.883-2.337 5.22-5.22 5.22-2.882 0-5.22-2.337-5.22-5.22 0-2.88 2.338-5.22 5.22-5.22 2.883 0 5.22 2.34 5.22 5.22z",
  },
  CU: {
    letter: "C",
    viewBox: "0 0 24 24",
    path: "M2 18.439l3.69-2.828c1.961 2.56 4.044 3.739 6.363 3.739 2.307 0 4.33-1.166 6.203-3.704L22 18.405C19.298 22.065 15.941 24 12.053 24 8.178 24 4.788 22.078 2 18.439zM12.04 6.15l-6.568 5.66-3.036-3.52L12.055 0l9.543 8.296-3.05 3.509z",
  },
  MON: {
    letter: "m",
    viewBox: "0 0 21.1 12.7",
    shapes: [
      {
        d: "M2.62 12.627A2.63 2.63 0 0 1 .328 11.297 2.543 2.543 0 0 1 .4 8.679L5.12 1.267a2.632 2.632 0 0 1 2.33-1.266 2.627 2.627 0 0 1 2.255 1.39c.44.832.385 1.833-.142 2.614l-4.717 7.412a2.631 2.631 0 0 1-2.226 1.21z",
        fill: "#f62b54",
      },
      {
        d: "M10.716 12.627C9.764 12.627 8.888 12.118 8.428 11.3A2.535 2.535 0 0 1 8.5 8.689l4.711-7.395a2.628 2.628 0 0 1 2.332-1.293c.96.021 1.83.558 2.27 1.398.437.84.373 1.847-.17 2.626l-4.71 7.395a2.627 2.627 0 0 1-2.217 1.207z",
        fill: "#ffcc00",
      },
      { ellipse: { cx: 18.631, cy: 10.31, rx: 2.43, ry: 2.379 }, fill: "#00ca72" },
    ],
  },
  SU: {
    letter: "S",
    viewBox: "0 0 22.3 25",
    shapes: [
      {
        d: "M0 9.835 14.896 9.835C18.613 9.835 21.698 12.273 22.293 15.82L7.396 15.819C3.68 15.819.595 13.382 0 9.835Z",
        fill: "#ff5757",
      },
      {
        d: "M0 24.82 14.896 24.819C18.613 24.819 21.698 22.389 22.293 18.841L7.396 18.842C3.68 18.842.595 21.272 0 24.82Z",
        fill: "#3a86ff",
      },
      {
        d: "M0 6.816 14.896 6.816C18.613 6.816 21.698 4.366 22.293.819L7.396.819C3.68.819.595 3.269 0 6.816Z",
        fill: "#ffb938",
      },
    ],
  },
  TW: { letter: "t", image: teamworkIcon, fillsTile: true },
  SS: { letter: "S", image: smartsheetLogo },
};
