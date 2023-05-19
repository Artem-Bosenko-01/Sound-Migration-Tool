import React, { useState } from 'react';
import LoginForm from './LoginForm';
import MigrationWizard from './MigrationWizard';
import UserSettings from './UserSettings';
import NotFoundPage from './NotFoundPage';
import RegistrationForm from './RegistrationForm';
import routeNames from './routeNames';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import SpotifyLogged from './SpotifyLogged';
import YoutubedataLogged from './YoutubedataLogged';
// import { onNavigateAfterError } from '../api-service';

const Routes = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   onNavigateAfterError(() => navigate(routeNames.login));
  // }, [navigate])

  return (
    <>
      <RouterRoutes>
        <Route path={routeNames.login} element={<LoginForm />} />
        <Route path={routeNames.register} element={<RegistrationForm />} />
        <Route path={routeNames.main} element={<MigrationWizard />} />
        <Route path={routeNames.userSettings} element={<UserSettings />} />
        <Route path={routeNames.authSpotify} element={<SpotifyLogged />} />
        <Route path={routeNames.authYoutubeData} element={<YoutubedataLogged />} />
        <Route path={routeNames.notFound} element={<NotFoundPage />} />
      </RouterRoutes>
    </>
  );
};

export default Routes;
