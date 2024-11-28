import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { MdExitToApp, MdLock } from 'react-icons/md'; // Import logout and login icons
import MainDashboard from '../../../views/admin/default';
import SignInCentered from '../../../views/auth/signIn'; // Import SignInCentered component

export function SidebarLinks(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const location = useLocation();

  // Get data from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Chakra color mode
  const activeColor = useColorModeValue('gray.700', 'white');
  const inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600',
  );
  const activeIcon = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('secondaryGray.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  const { routes } = props;

  // Verifies if routeName is active
  const activeRoute = (routeName) => location.pathname.includes(routeName);

  // Function to create links
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // If the route requires a specific role, ensure the user has the correct role
      if (route.roles && !route.roles.includes(userRole)) {
        return null;
      }

      return (
        <NavLink
          key={index}
          to={route.layout + route.path}
          onClick={route.onClick}
        >
          {route.icon ? (
            <Box>
              <HStack
                spacing={
                  activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                }
                py="5px"
                ps="10px"
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  <Box
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeIcon
                        : textColor
                    }
                    me="18px"
                  >
                    {route.icon}
                  </Box>
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : textColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
                    }
                  >
                    {route.name}
                  </Text>
                </Flex>
                <Box
                  h="36px"
                  w="4px"
                  bg={
                    activeRoute(route.path.toLowerCase())
                      ? brandColor
                      : 'transparent'
                  }
                  borderRadius="5px"
                />
              </HStack>
            </Box>
          ) : (
            <Box>
              <HStack
                spacing={
                  activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                }
                py="5px"
                ps="10px"
              >
                <Text
                  me="auto"
                  color={
                    activeRoute(route.path.toLowerCase())
                      ? activeColor
                      : inactiveColor
                  }
                  fontWeight={
                    activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
                  }
                >
                  {route.name}
                </Text>
                <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
              </HStack>
            </Box>
          )}
        </NavLink>
      );
    });
  };

  // Handle logout and remove data from localStorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false); // Set login state to false
    window.location.reload(); // Force page reload to reflect changes
  };

  // Filter routes based on login status
  const filteredRoutes = isLoggedIn
    ? routes.map((route) => {
        // Modify the logout route to 'Keluar' if logged in
        if (route.name === 'Masuk') {
          return {
            ...route,
            name: 'Keluar',
            layout: '/admin',
            path: '/default',
            icon: (
              <Icon
                as={MdExitToApp}
                width="20px"
                height="20px"
                color="inherit"
              />
            ),
            component: <MainDashboard />, // Or whichever component you want to show for the "Keluar" route
            onClick: handleLogout, // Add onClick handler for logout
          };
        }
        return route;
      })
    : routes.map((route) => {
        // Modify the route to 'Masuk' if not logged in
        if (route.name === 'Keluar') {
          return {
            ...route,
            name: 'Masuk',
            layout: '/auth',
            path: '/sign-in',
            icon: (
              <Icon as={MdLock} width="20px" height="20px" color="inherit" />
            ),
            component: <SignInCentered />, // Or whichever component you want to show for the "Masuk" route
            onClick: null, // Remove the onClick handler for login
          };
        }
        return route;
      });

  return createLinks(filteredRoutes);
}

export default SidebarLinks;
