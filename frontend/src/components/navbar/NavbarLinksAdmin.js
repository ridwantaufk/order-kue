// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useBreakpointValue,
} from '@chakra-ui/react';
// Custom Components
import { ItemContent } from 'components/menu/ItemContent';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import noImage from '../../assets/img/avatars/no-profil.png';
// Assets
import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
import routes from 'routes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function HeaderLinks(props) {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const [imageHovered, setImageHovered] = useState(false);
  const [nama, setNama] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const openTime = '08:00 AM';
  const closeTime = '06:00 PM';
  const totalVisitors = 125; // Anda bisa mengganti ini dengan data dinamis
  const textGray = useColorModeValue('gray.600', 'gray.300');
  const statColor = useColorModeValue('green.500', 'green.300');

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const time = new Date();
      setCurrentTime(time.toLocaleTimeString());
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId); // Membersihkan interval saat komponen di-unmount
  }, []);

  const handleMouseEnter = () => {
    setImageHovered(true);
  };

  const handleMouseLeave = () => {
    setImageHovered(false);
  };

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      console.log('token : ', localStorage.getItem('token'));
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
          const nama_user = response.data.name;
          setNama(nama_user);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error message : ', error.message);
          if (error.response.data.message) {
            console.error(
              'Error response Auth MiddleWare : ',
              error.response.data.message,
            );
          }
        }
      };

      fetchLoginUser();
    }
  }, []);

  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  let menuBgHovered = useColorModeValue('#e2e8f0', 'navy.700');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />
      <Flex
        bg={ethBg}
        display={secondary ? 'flex' : 'none'}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
        <Flex
          align="center"
          justify="center"
          bg={ethBox}
          h="29px"
          w="29px"
          borderRadius="30px"
          me="7px"
        >
          <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
        </Flex>
        <Text
          w="max-content"
          color={ethColor}
          fontSize="sm"
          fontWeight="700"
          me="6px"
        >
          1,924
          <Text as="span" display={{ base: 'none', md: 'unset' }}>
            {' '}
            ETH
          </Text>
        </Text>
      </Flex>
      {isAuthenticated() && <SidebarResponsive routes={routes} />}
      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: '30px', md: 'unset' }}
          minW={{ base: 'unset', md: '400px', xl: '450px' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notifications
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              Mark all read
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <ItemContent info="Horizon UI Dashboard PRO" />
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <ItemContent info="Horizon Design System Free" />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdInfoOutline}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          me={{ base: '30px', md: 'unset' }}
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: 'unset' }}
          maxW={{ base: '360px', md: 'unset' }}
          p={4}
        >
          <Flex flexDirection="column" align="center" justify="center" w="100%">
            <Text fontSize="2xl" fontWeight="bold" color="blue.500" mb={4}>
              Informasi Hari Ini
            </Text>

            {/* Jam Digital */}
            <Flex direction="column" align="center" mb={6}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
                Jam Sekarang :
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color={textGray}>
                {currentTime}
              </Text>
            </Flex>

            {/* Informasi Jam Buka dan Tutup */}
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              mb={6}
              w="100%"
            >
              <Flex w="48%" direction="column" align="start">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Jam Buka :
                </Text>
                <Text fontSize="md" color={textGray}>
                  {openTime}
                </Text>
              </Flex>

              <Flex w="48%" direction="column" align="start">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Jam Tutup :
                </Text>
                <Text fontSize="md" color={textGray}>
                  {closeTime}
                </Text>
              </Flex>
            </Flex>

            {/* Informasi Total Pengunjung */}
            <Stat>
              <StatLabel
                fontSize="lg"
                fontWeight="bold"
                mb={2}
                color={textColor}
              >
                Total Pengunjung Hari Ini
              </StatLabel>
              <StatNumber fontSize="3xl" color={statColor}>
                {totalVisitors}
              </StatNumber>
              <StatHelpText fontSize="sm" color="gray.500">
                Data ini berdasarkan pengunjung yang terdaftar hari ini.
              </StatHelpText>
            </Stat>
          </Flex>
        </MenuList>
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      {isAuthenticated() && (
        <Menu>
          <MenuButton
            p="0px"
            onMouseEnter={() => {
              handleMouseEnter();
            }}
            onMouseLeave={() => {
              handleMouseLeave();
            }}
            _hover={{
              boxShadow: '0px 0px 20px #0c34c7',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              borderRadius: '50%',
            }}
            borderRadius={'50%'}
            transition={'background-color 0.3s ease, box-shadow 0s'}
          >
            {nama !== '' ? (
              <Avatar
                _hover={{
                  cursor: 'pointer',
                }}
                color="white"
                name={nama}
                bg="linear-gradient(45deg, #02124a, #0c34c7)"
                size="sm"
                w="40px"
                h="40px"
              />
            ) : (
              <Avatar
                _hover={{ cursor: 'pointer' }}
                color="white"
                src={imageHovered ? '' : noImage}
                name={''}
                alt="no profile"
                bg={
                  imageHovered
                    ? 'linear-gradient(45deg, #02124a, #0c34c7)'
                    : colorMode === 'light'
                    ? 'white'
                    : 'navy.800'
                }
                objectFit="cover"
                w="30px"
                h="30px"
                borderRadius={imageHovered ? '50%' : '0%'}
              />
            )}
            {/* {console.log('imageHovered : ', imageHovered)} */}
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                👋&nbsp; {nama ? `Hey, ${nama}` : `Hey !`}
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              <MenuItem
                onClick={() => navigate('/admin/profile')}
                _hover={{
                  bg: menuBgHovered,
                  transition: 'background-color 0.5s, border-color 0.3s',
                }}
                // _focus={{ bg: 'none' }}
                borderRadius="8px"
                px="14px"
                bg={menuBg}
              >
                <Text fontSize="sm">Pengaturan Profil</Text>
              </MenuItem>
              <MenuItem
                _hover={{
                  bg: menuBgHovered,
                  transition: 'background-color 0.5s, border-color 0.3s',
                }}
                // _focus={{ bg: 'none' }}
                color="red.400"
                borderRadius="8px"
                px="14px"
                bg={menuBg}
                onClick={() => {
                  if (isLoggedIn) {
                    localStorage.clear();
                    setIsLoggedIn(false); // Set login state to false
                    window.location.reload(); // Force page reload to reflect changes
                  } else {
                    window.location.href = '/auth/sign-in';
                  }
                }}
              >
                <Text fontSize="sm">{isLoggedIn ? 'Keluar' : 'Masuk'}</Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
