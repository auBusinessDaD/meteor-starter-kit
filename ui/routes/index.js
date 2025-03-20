import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';

// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// components
import LoadingScreen from '../components/LoadingScreen';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/analytics" /> },
        { path: 'profile/:userId', element: <Profile /> },
        { path: 'analytics', element: <GeneralApp /> },

        // ratings
        { path: 'ratings', element: <Ratings /> },
        { path: 'ratings/create', element: <RatingCreate /> },
        { path: 'ratings/:ratingId/edit', element: <RatingCreate /> },

        // levels
        { path: 'levels', element: <Levels /> },
        { path: 'levels/create', element: <LevelCreate /> },
        { path: 'levels/:levelId/edit', element: <LevelCreate /> },

        // domains
        { path: 'domains', element: <Domains /> },
        { path: 'domains/create', element: <DomainCreate /> },
        { path: 'domains/:domainId/edit', element: <DomainCreate /> },

        // strands
        { path: 'strands', element: <Strands /> },
        { path: 'strands/create', element: <StrandCreate /> },
        { path: 'strands/:strandId/edit', element: <StrandCreate /> },

        // units
        { path: 'units', element: <Units /> },
        { path: 'units/create', element: <UnitCreate /> },
        { path: 'units/:unitId/edit', element: <UnitCreate /> },

        // Admin/users
        {
          path: 'users',
          element: (
            <RoleBasedGuard>
              <User />
            </RoleBasedGuard>
          )
        },
        {
          path: 'users/:userId/edit',
          element: (
            <RoleBasedGuard>
              <UserProfile />
            </RoleBasedGuard>
          )
        },

        // Admin/user-settings
        {
          path: 'user-settings',
          element: (
            <RoleBasedGuard>
              <UserSettings />
            </RoleBasedGuard>
          )
        }
      ]
    },
    {
      path: 'auth',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="login" /> },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> }
      ]
    },
    { path: '/verify-email/:token', element: <VerifyEmail /> },
    { path: '/reset-password/:token', element: <NewPassword /> },

    // Main RoutesResetPassword
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'contact-us', element: <ContactPage /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// main pages
const HomePage = Loadable(lazy(() => import('../pages/external_pages/Home')));
const ContactPage = Loadable(lazy(() => import('../pages/external_pages/Contact')));

// others
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const Page404 = Loadable(lazy(() => import('../pages/other/Page404')));

// ratings
const Ratings = Loadable(lazy(() => import('../pages/dashboard/rating')));
const RatingCreate = Loadable(lazy(() => import('../pages/dashboard/rating/RatingCreate')));

// levels
const Levels = Loadable(lazy(() => import('../pages/dashboard/level')));
const LevelCreate = Loadable(lazy(() => import('../pages/dashboard/level/LevelCreate')));

// domains
const Domains = Loadable(lazy(() => import('../pages/dashboard/domain')));
const DomainCreate = Loadable(lazy(() => import('../pages/dashboard/domain/DomainCreate')));

// strands
const Strands = Loadable(lazy(() => import('../pages/dashboard/strand')));
const StrandCreate = Loadable(lazy(() => import('../pages/dashboard/strand/StrandCreate')));

// units
const Units = Loadable(lazy(() => import('../pages/dashboard/unit')));
const UnitCreate = Loadable(lazy(() => import('../pages/dashboard/unit/UnitCreate')));

// users
const User = Loadable(lazy(() => import('../pages/dashboard/user')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/user-profile')));

// user settings
const UserSettings = Loadable(lazy(() => import('../pages/dashboard/userSettings')));

const Profile = Loadable(lazy(() => import('../pages/profile')));

// authentications
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/authentication/NewPassword')));
const VerifyEmail = Loadable(lazy(() => import('../pages/authentication/VerifyEmail')));
