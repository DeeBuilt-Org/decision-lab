import { useEffect, useState } from "react";
import { Layout, Grid, Drawer, Button, Tooltip, Typography } from "antd";
import { MoonIcon, ScalesIcon, SunIcon } from "@phosphor-icons/react";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import DeeBuiltCredit from "@/components/DeeBuiltCredit";
import { useThemeMode } from "@/lib/theme";
import { haptic } from "@/lib/haptics";
import AboutModal from "@/components/AboutModal";
import PrivacyModal from "@/components/PrivacyModal";
import { SideNav } from "./SideNav";
import "./layout.css";

const { Content, Footer } = Layout;
const { Link, Text } = Typography;
const { useBreakpoint } = Grid;

const SIDEBAR_COLLAPSED_KEY = "decision-lab-sidebar-collapsed";

/**
 * The persistent app chrome: header, a collapsible left nav (a Drawer standing
 * in on mobile), and the routed page via <Outlet/>. Every route except NotFound
 * renders inside this.
 *
 * The header's nav toggle collapses the rail on desktop and opens the Drawer
 * on mobile. On desktop the rail's foot holds the credit and the About /
 * Privacy links; only phones get a footer under the page.
 */
export default function AppLayout() {
  const { mode, toggle } = useThemeMode();
  const isDark = mode === "dark";
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      /* non-fatal: the collapse state just won't persist */
    }
  }, [collapsed]);

  const openAbout = () => {
    setDrawerOpen(false);
    setAboutOpen(true);
  };
  const openPrivacy = () => {
    setDrawerOpen(false);
    setPrivacyOpen(true);
  };

  return (
    <Layout className="dl-layout">
      <AppHeader
        mark={<ScalesIcon weight="bold" />}
        name="Decision Lab"
        navLabel={isMobile ? "Open navigation" : collapsed ? "Expand navigation" : "Collapse navigation"}
        onToggleNav={() => {
          haptic("tap");
          if (isMobile) setDrawerOpen(true);
          else setCollapsed((c) => !c);
        }}
        actions={
          <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
            <Button
              type="text"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              icon={isDark ? <SunIcon /> : <MoonIcon />}
              onClick={() => {
                haptic("tap");
                toggle();
              }}
              className="app-header__btn"
            />
          </Tooltip>
        }
      />

      <Layout className="dl-body" hasSider={!isMobile}>
        {isMobile ? (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="left"
            width={264}
            closable={false}
            styles={{ body: { padding: 0 } }}
          >
            <SideNav
              collapsed={false}
              onNavigate={() => setDrawerOpen(false)}
              onAbout={openAbout}
              onPrivacy={openPrivacy}
            />
          </Drawer>
        ) : (
          <SideNav collapsed={collapsed} onAbout={openAbout} onPrivacy={openPrivacy} />
        )}

        <Layout className="dl-main">
          <Content className="dl-content">
            <Outlet />
          </Content>

          {isMobile && (
            <Footer className="dl-footer">
              <div className="dl-footer-inner">
                <DeeBuiltCredit />
                <div className="dl-footer-links">
                  <Link onClick={openAbout}>About</Link>
                  <Text type="secondary">·</Text>
                  <Link onClick={openPrivacy}>Privacy</Link>
                </div>
              </div>
            </Footer>
          )}
        </Layout>
      </Layout>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </Layout>
  );
}
