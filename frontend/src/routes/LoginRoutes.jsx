import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    // default: / → /login
    {
      index: true,
      element: <Navigate to="/login" replace />
    },
    {
      path: 'login',
      element: <LoginPage />
    }
  ]
};

export default LoginRoutes;





