import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import AppLayout from "@/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import PlatformPickerPage from "@/quizzes/platform-picker/PlatformPickerPage";

// Derived from Vite's base so the same build works at "/" in dev and
// "/decision-lab/" in production, with no env var to forget.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* Each quiz is a fixed screen with its own route. */}
            <Route path="/platform-picker" element={<PlatformPickerPage />} />
          </Route>
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
