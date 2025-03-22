// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  analytics: path(ROOTS_DASHBOARD, '/analytics'),
  profile: path(ROOTS_DASHBOARD, '/profile'),

  // ratings
  rating: {
    root: path(ROOTS_DASHBOARD, '/ratings'),
    create: path(ROOTS_DASHBOARD, '/ratings/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/ratings/${name}/edit`),
  },

  // levels
  level: {
    root: path(ROOTS_DASHBOARD, '/levels'),
    create: path(ROOTS_DASHBOARD, '/levels/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/levels/${name}/edit`),
  },

  // domains
  domain: {
    root: path(ROOTS_DASHBOARD, '/domains'),
    create: path(ROOTS_DASHBOARD, '/domains/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/domains/${name}/edit`),
  },

  // strands
  strand: {
    root: path(ROOTS_DASHBOARD, '/strands'),
    create: path(ROOTS_DASHBOARD, '/strands/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/strands/${name}/edit`),
  },

  // units
  unit: {
    root: path(ROOTS_DASHBOARD, '/units'),
    create: path(ROOTS_DASHBOARD, '/units/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/units/${name}/edit`),
  },

  // classes
  class: {
    root: path(ROOTS_DASHBOARD, '/classes'),
    create: path(ROOTS_DASHBOARD, '/classes/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/classes/${name}/edit`),
  },

  // continuum
  cont: {
    root: path(ROOTS_DASHBOARD, '/continuum'),
    create: path(ROOTS_DASHBOARD, '/continuum/create'),
    edit: (name) => path(ROOTS_DASHBOARD, `/continuum/${name}/edit`),
  },

  // users
  user: {
    root: path(ROOTS_DASHBOARD, '/users'),
    edit: (name) => path(ROOTS_DASHBOARD, `/users/${name}/edit`),
    settings: path(ROOTS_DASHBOARD, '/user-settings'),
  },

  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied')
};
