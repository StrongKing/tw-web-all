import React from 'react';

export default [
  {
    path: 'list',
    Com: React.lazy(() => import('./modules/list')),
  },
  {
    path: 'setting',
    Com: React.lazy(() => import('./modules/setting')),
  },
];
