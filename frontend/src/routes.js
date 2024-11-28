import React from 'react';
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
import NFTMarketplace from 'views/admin/marketplace';
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

const routes = [
  {
    name: 'Beranda Utama',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Orderan',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: 'Ringkasan Data',
    layout: '/admin',
    roles: ['admin1'],
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: isAuthenticated() ? (
      <DataTables />
    ) : (
      <Navigate to="/auth/sign-in" />
    ), // Redirect to login if not authenticated
  },
  {
    name: 'Mastering',
    layout: '/admin',
    roles: ['admin1'],
    path: '/master-transaksi',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: isAuthenticated() ? (
      <MasterTransaksi />
    ) : (
      <Navigate to="/auth/sign-in" />
    ), // Redirect to login if not authenticated
  },
  {
    name: 'Profil',
    layout: '/admin',
    roles: ['admin1'],
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: isAuthenticated() ? (
      <Profile />
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
