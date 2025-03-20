import React from 'react';
// component
import Iconify from '../../components/Iconify';

import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    subheader: 'DASHBOARD',
    items: [
      {
        title: 'dashboard',
        path: `${PATH_DASHBOARD.analytics}`,
        icon: getIcon('eva:pie-chart-2-fill'),
      },
    ],
  },
  {
    subheader: 'Admin',
    items: [
      {
        title: 'ratings',
        path: `${PATH_DASHBOARD.rating.root}`,
        icon: getIcon('gala:file-doc'),
      },
      {
        title: 'levels',
        path: `${PATH_DASHBOARD.level.root}`,
        icon: getIcon('gala:file-doc'),
      },
      {
        title: 'domains',
        path: `${PATH_DASHBOARD.domain.root}`,
        icon: getIcon('gala:file-doc'),
      },
      {
        title: 'strands',
        path: `${PATH_DASHBOARD.strand.root}`,
        icon: getIcon('gala:file-doc'),
      },
      {
        title: 'units',
        path: `${PATH_DASHBOARD.unit.root}`,
        icon: getIcon('gala:file-doc'),
      },
      {
        title: 'users',
        path: `${PATH_DASHBOARD.user.root}`,
        icon: getIcon('gis:globe-users'),
      },
      {
        title: 'user settings',
        path: `${PATH_DASHBOARD.user.settings}`,
        icon: getIcon('fluent:people-settings-28-regular'),
      },
    ],
  },
];

export default navConfig;
