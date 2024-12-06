import React, { useState } from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { Navigate } from 'react-router-dom'; // Import Navigate untuk redireksi

import MainDashboard from 'views/admin/default';
import Orderan from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import MasterTransaksi from 'views/admin/masterTransaksi';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

// Function to check if the user is logged in
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Return true if token exists (user is logged in)
};

const highAccessRighted = () => {
  return localStorage.getItem('role') === 'admin';
};

const accessRighted = () => {
  if (localStorage.getItem('role') === 'ridwan') {
    return localStorage.getItem('role');
  } else if (localStorage.getItem('role') === 'andri') {
    return localStorage.getItem('role');
  } else if (localStorage.getItem('role') === 'asri') {
    return localStorage.getItem('role');
  }
  return null;
};

const routes = [
  {
    name: 'Beranda Utama',
    layout: '/admin',
    path: '/default',
    roles: ['admin'],
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: isAuthenticated() ? (
      highAccessRighted() ? (
        <MainDashboard />
      ) : (
        <Navigate to={window.location.pathname} />
      )
    ) : (
      <Navigate to="/auth/sign-in" />
    ),
  },
  {
    name: 'Orderan',
    layout: '/orderan',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Orderan />,
    secondary: true,
  },
  {
    name: 'Ringkasan Data',
    layout: '/admin',
    roles: ['admin', 'ridwan', 'asri'],
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: isAuthenticated() ? (
      ['admin', 'ridwan', 'asri'].includes(accessRighted()) ? (
        <DataTables />
      ) : (
        <Navigate to={window.location.pathname} />
      )
    ) : (
      <Navigate to="/auth/sign-in" />
    ), // Redirect to login if not authenticated
  },
  {
    name: 'Mastering',
    layout: '/admin',
    roles: ['admin', 'ridwan', 'andri'],
    path: '/master-transaksi',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: isAuthenticated() ? (
      ['admin', 'ridwan', 'andri'].includes(accessRighted()) ? (
        <MasterTransaksi />
      ) : (
        <Navigate to={window.location.pathname} />
      )
    ) : (
      <Navigate to="/auth/sign-in" />
    ), // Redirect to login if not authenticated
  },
  {
    name: 'Profil',
    layout: '/admin',
    roles: ['admin', 'ridwan', 'andri', 'asri'],
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: isAuthenticated() ? (
      ['admin', 'ridwan', 'andri', 'asri'].includes(accessRighted()) ? (
        <Profile />
      ) : (
        <Navigate to={window.location.pathname} />
      )
    ) : (
      <Navigate to="/auth/sign-in" />
    ), // Redirect to login if not authenticated
  },
  {
    name: 'Masuk',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
