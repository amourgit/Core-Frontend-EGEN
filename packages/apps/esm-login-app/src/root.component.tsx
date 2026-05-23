// ============================================================
// esm-login-app/src/root.component.tsx
// Racine du micro-frontend Login — le ThemeProvider est ici
// pour que TOUS les composants enfants aient accès au système
// de thème dynamique via useTheme() et les CSS variables.
// ============================================================
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@egen/esm-framework';
import ChangePassword from './change-password/change-password.component';
import LocationPickerView from './location-picker/location-picker-view.component';
import Login from './login/login.component';
import RedirectLogout from './redirect-logout/redirect-logout.component';

const Root: React.FC = () => {
  return (
    // ── ThemeProvider ─────────────────────────────────────────
    // Charge le thème dynamique depuis /themes/default.json,
    // injecte les CSS variables dans :root, et expose useTheme().
    // enableDarkMode=true : respecte la préférence système + localStorage.
    <ThemeProvider defaultTheme="default" enableDarkMode={true}>
      <BrowserRouter
        basename={window.getEgenSpaBase()}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="login"             element={<Login />} />
          <Route path="login/confirm"     element={<Login />} />
          <Route path="login/location"    element={<LocationPickerView />} />
          <Route path="logout"            element={<RedirectLogout />} />
          <Route path="change-password"   element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Root;
