import React from 'react';
import LoginForm from './LoginForm';
import MigrationWizard from './MigrationWizard';
import UserSettings from './UserSettings';
import NotFoundPage from './NotFoundPage';
import RegistrationForm from './RegistrationForm';
import routeNames from './routeNames';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const Routes = () => (
  <>
    <RouterRoutes>
      <Route path={routeNames.login} element={<LoginForm />} />
      <Route path={routeNames.register} element={<RegistrationForm />} />
      <Route path={routeNames.main} element={<MigrationWizard />} />
      <Route path={routeNames.userSettings} element={<UserSettings />} />
      <Route path={routeNames.notFound} element={<NotFoundPage />} />
    </RouterRoutes>
  </>
);

export default Routes;
