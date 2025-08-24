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
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SidebarLinks(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const location = useLocation();

  // Get data from localStorage
  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    console.log('localStorage : ', localStorage.getItem('token'));
    if (user_id) {
      console.log('token : ', localStorage.getItem('token'));
      console.log('user_id : ', user_id);
      const fetchLoginUser = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/privateUser/${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'ngrok-skip-browser-warning': 'true',
              },
            },
          );
          console.log('response : ', response);

          setIsLoggedIn(true);
          setUserRole(localStorage.getItem('role'));
        } catch (error) {
          console.error('Error message login : ', error.message);
          if (error?.response?.data.message) {
            localStorage.clear();
            setIsLoggedIn(false);
            setUserRole(null);
            console.error(
              'Error response Auth MiddleWare : ',
              error.response.data.message,
            );
            toast.error('Sesi login telah berakhir. Harap login kembali.', {
              position: 'top-right',
            });
          }
        }
      };

      fetchLoginUser();
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

      if (
        (route.name === 'Masuk' || route.name === 'Daftar') &&
        isLoggedIn
      ) {
        return null;
      }

      if (route.name === 'Orderan' && isLoggedIn) {
        return null;
      }

      return (
        <NavLink
          key={index}
          to={route.path ? route.layout + route.path : route.layout}
          onClick={route.onClick}
        >
          {route.icon ? (
            <Box>
              <HStack
                spacing={
                  activeRoute(
                    route.path
                      ? route.path.toLowerCase()
                      : route.layout.toLowerCase(),
                  )
                    ? '22px'
                    : '26px'
                }
                py="5px"
                ps="10px"
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  <Box
                    color={
                      activeRoute(
                        route.path
                          ? route.path.toLowerCase()
                          : route.layout.toLowerCase(),
                      )
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
                      activeRoute(
                        route.path
                          ? route.path.toLowerCase()
                          : route.layout.toLowerCase(),
                      )
                        ? activeColor
                        : textColor
                    }
                    fontWeight={
                      activeRoute(
                        route.path
                          ? route.path.toLowerCase()
                          : route.layout.toLowerCase(),
                      )
                        ? 'bold'
                        : 'normal'
                    }
                  >
                    {route.name}
                  </Text>
                </Flex>
                <Box
                  h="36px"
                  w="4px"
                  bg={
                    activeRoute(
                      route.path
                        ? route.path.toLowerCase()
                        : route.layout.toLowerCase(),
                    )
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
                  activeRoute(
                    route.path
                      ? route.path.toLowerCase()
                      : route.layout.toLowerCase(),
                  )
                    ? '22px'
                    : '26px'
                }
                py="5px"
                ps="10px"
              >
                <Text
                  me="auto"
                  color={
                    activeRoute(
                      route.path
                        ? route.path.toLowerCase()
                        : route.layout.toLowerCase(),
                    )
                      ? activeColor
                      : inactiveColor
                  }
                  fontWeight={
                    activeRoute(
                      route.path
                        ? route.path.toLowerCase()
                        : route.layout.toLowerCase(),
                    )
                      ? 'bold'
                      : 'normal'
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

  return createLinks(routes);
}

export default SidebarLinks;
