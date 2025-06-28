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
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import noImage from '../../assets/img/avatars/no-profil.png';
// Assets
import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
import routes from 'routes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { DateTime } from 'luxon';

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

  // State untuk data realtime
  const [todayOrders, setTodayOrders] = useState([]);
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    uniqueIPs: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState('');

  // Ref untuk audio dan socket
  const audioRef = useRef(null);
  const socketRef = useRef(null);
  const previousOrdersRef = useRef([]);

  const openTime = '08:00 AM';
  const closeTime = '06:00 PM';
  const textGray = useColorModeValue('gray.600', 'gray.300');
  const statColor = useColorModeValue('green.500', 'green.300');

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Memoized values untuk mencegah re-render
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const menuBg = useColorModeValue('white', 'navy.800');
  const menuBgHovered = useColorModeValue('#e2e8f0', 'navy.700');
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
  const bgNotif = useColorModeValue('gray.100', 'gray.700');
  const bgMenuItem = useColorModeValue('blue.50', 'blue.900');

  // Fungsi untuk memainkan suara notifikasi - menggunakan useCallback
  const playNotificationSound = useCallback(() => {
    try {
      // Coba gunakan audio file terlebih dahulu
      if (!audioRef.current) {
        audioRef.current = new Audio();
        // Gunakan suara notifikasi yang tersedia di browser
        audioRef.current.src = '/assets/sounds/notification-alert.mp3';

        // Alternatif: Gunakan file audio yang ada
        // audioRef.current.src = '/notification.mp3';

        audioRef.current.volume = 0.7;
        audioRef.current.preload = 'auto';
      }

      // Reset dan play
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.log('Could not play notification sound:', e);

          // Fallback: Gunakan Web Audio API untuk beep sound
          try {
            const audioContext = new (window.AudioContext ||
              window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.3,
              audioContext.currentTime + 0.1,
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.5,
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);

            console.log('Played fallback beep sound');
          } catch (fallbackError) {
            console.error('Error playing fallback sound:', fallbackError);
          }
        });
      }
    } catch (error) {
      console.error('Error in playNotificationSound:', error);
    }
  }, []);

  // return <button onClick={playNotificationSound}>Test Sound</button>;

  // Fungsi untuk menyimpan status read notifications - menggunakan useCallback
  const saveReadNotifications = useCallback((readNotifications) => {
    try {
      const readNotifIds = readNotifications.map((notif) => notif.id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifIds));
    } catch (error) {
      console.error('Error saving read notifications:', error);
    }
  }, []);

  // Fungsi untuk mengambil status read notifications - menggunakan useCallback
  const getReadNotifications = useCallback(() => {
    try {
      const readNotifIds = localStorage.getItem('readNotifications');
      return readNotifIds ? JSON.parse(readNotifIds) : [];
    } catch (error) {
      console.error('Error getting read notifications:', error);
      return [];
    }
  }, []);

  // Fungsi untuk memfilter notifikasi berdasarkan konteks - menggunakan useCallback
  const filterNotificationsByContext = useCallback((ordersData) => {
    const orderCode = localStorage.getItem('order_code');
    const userId = localStorage.getItem('user_id');

    if (orderCode && orderCode !== 'null' && orderCode !== '') {
      const orderCodes = orderCode.split(',');
      return ordersData.filter((order) =>
        orderCodes.includes(order.order_code),
      );
    } else if (userId && userId !== 'null' && userId !== '') {
      return ordersData;
    }

    return [];
  }, []);

  // Filter orders by today's date - menggunakan useCallback
  const filterOrdersByDate = useCallback((ordersData) => {
    const today = DateTime.now().setZone('Asia/Jakarta').toISODate();

    if (process.env.REACT_APP_BACKEND_URL.includes('railway')) {
      return ordersData
        .filter((order) => {
          const orderDate = DateTime.fromISO(order.updated_at)
            .toUTC()
            .toISODate();
          return orderDate === today;
        })
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else {
      return ordersData
        .filter((order) => {
          const orderDate = DateTime.fromISO(order.updated_at, {
            zone: 'Asia/Jakarta',
          }).toISODate();
          return orderDate === today;
        })
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
  }, []);

  // Update waktu setiap detik
  useEffect(() => {
    const updateTime = () => {
      const time = new Date();
      setCurrentTime(time.toLocaleTimeString());
    };

    updateTime(); // Set initial time
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Socket.IO untuk orders realtime - Diperbaiki untuk mencegah re-render
  useEffect(() => {
    if (socketRef.current) {
      return; // Socket sudah ada, jangan buat lagi
    }

    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: { 'ngrok-skip-browser-warning': 'true' },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server for orders');
    });

    socket.on('initialOrders', (initialDataOrders) => {
      const filteredOrders = filterOrdersByDate(initialDataOrders);
      const contextFilteredOrders =
        filterNotificationsByContext(filteredOrders);

      setTodayOrders(filteredOrders);
      previousOrdersRef.current = filteredOrders;
      console.log('Initial orders received:', filteredOrders.length);

      // Create initial notifications from recent orders
      const readNotifIds = getReadNotifications();
      const recentNotifications = contextFilteredOrders
        .slice(0, 10)
        .map((order) => ({
          id: `order-${order.order_id}`,
          type: 'order',
          title: 'Pesanan',
          message: `Pesanan dari ${order.customer_name}`,
          orderCode: order.order_code,
          status: order.status,
          timestamp: new Date(order.updated_at),
          isRead: readNotifIds.includes(`order-${order.order_id}`),
        }));

      setNotifications(recentNotifications);
      setUnreadCount(
        recentNotifications.filter((notif) => !notif.isRead).length,
      );
    });

    socket.on('ordersUpdate', (updatedDataOrders) => {
      const filteredOrders = filterOrdersByDate(updatedDataOrders);
      const contextFilteredOrders =
        filterNotificationsByContext(filteredOrders);
      const previousOrders = previousOrdersRef.current;

      console.log('Orders updated:', filteredOrders.length);

      // Cek apakah ada pesanan baru atau perubahan status
      const hasNewOrders = filteredOrders.length > previousOrders.length;
      const hasStatusChanges = filteredOrders.some((updatedOrder) => {
        const existingOrder = previousOrders.find(
          (order) => order.order_id === updatedOrder.order_id,
        );
        return existingOrder && existingOrder.status !== updatedOrder.status;
      });

      if (hasNewOrders || hasStatusChanges) {
        const readNotifIds = getReadNotifications();
        const newNotifications = [];

        // Cek pesanan baru
        if (hasNewOrders) {
          const newOrders = filteredOrders.filter(
            (order) =>
              !previousOrders.some(
                (prevOrder) => prevOrder.order_id === order.order_id,
              ),
          );

          newOrders.forEach((order) => {
            const newNotification = {
              id: `order-${order.order_id}`,
              type: 'order',
              title: 'Pesanan Baru Masuk!',
              message: `Pesanan baru dari ${order.customer_name}`,
              orderCode: order.order_code,
              status: order.status,
              timestamp: new Date(),
              isRead: false,
            };
            newNotifications.push(newNotification);
          });
        }

        // Cek perubahan status
        if (hasStatusChanges) {
          filteredOrders.forEach((updatedOrder) => {
            const existingOrder = previousOrders.find(
              (order) => order.order_id === updatedOrder.order_id,
            );

            if (existingOrder && existingOrder.status !== updatedOrder.status) {
              const statusNotification = {
                id: `status-${updatedOrder.order_id}-${Date.now()}`,
                type: 'status',
                title: 'Status Pesanan Berubah',
                message: `Pesanan ${updatedOrder.order_code} berubah ke "${updatedOrder.status}"`,
                orderCode: updatedOrder.order_code,
                status: updatedOrder.status,
                timestamp: new Date(),
                isRead: false,
              };
              newNotifications.push(statusNotification);
            }
          });
        }

        // Update state dan mainkan suara jika ada notifikasi baru
        if (newNotifications.length > 0) {
          setNotifications((prev) => {
            const updatedNotifications = [...newNotifications, ...prev].slice(
              0,
              10,
            );
            return updatedNotifications.map((notif) => ({
              ...notif,
              isRead: readNotifIds.includes(notif.id) ? true : notif.isRead,
            }));
          });

          setUnreadCount((prev) => prev + newNotifications.length);

          // Mainkan suara notifikasi
          console.log(
            'Playing notification sound for',
            newNotifications.length,
            'new notifications',
          );
          playNotificationSound();

          // Desktop notification jika browser tidak dalam focus
          if (
            !document.hasFocus() &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification('Notifikasi Baru', {
              body: newNotifications[0].message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
            });
          }
        }
      }

      // Update state
      setTodayOrders(filteredOrders);
      previousOrdersRef.current = filteredOrders;
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array untuk mencegah re-render

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Fetch visitor stats
  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const [statsResponse, dailyResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/stats`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/daily`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }),
        ]);

        setVisitorStats(statsResponse.data);
        // console.log('Visitor stats updated:', statsResponse.data);
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
      }
    };

    fetchVisitorStats();

    // Update visitor stats setiap 30 detik
    const visitorInterval = setInterval(fetchVisitorStats, 30000);

    return () => clearInterval(visitorInterval);
  }, []);

  // Function to mark all notifications as read - menggunakan useCallback
  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    saveReadNotifications(updatedNotifications);
  }, [notifications, saveReadNotifications]);

  // Function to handle notification menu open/close - menggunakan useCallback
  const handleNotificationMenuToggle = useCallback(
    (isOpen) => {
      setIsNotificationMenuOpen(isOpen);
      if (isOpen && unreadCount > 0) {
        markAllAsRead();
      }
    },
    [unreadCount, markAllAsRead],
  );

  // Function to get status color - menggunakan useCallback
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'Pending':
        return 'orange.500';
      case 'Diproses':
        return 'blue.500';
      case 'Selesai':
        return 'green.500';
      case 'Dibatalkan':
        return 'red.500';
      default:
        return 'gray.500';
    }
  }, []);

  // Function to format time - menggunakan useCallback
  const formatTime = useCallback((date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Fetch user data
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
          if (error?.response?.data?.message) {
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

  const handleMouseEnter = useCallback(() => {
    setImageHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setImageHovered(false);
  }, []);

  const handleLogout = useCallback(() => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.reload();
    } else {
      window.location.href = '/auth/sign-in';
    }
  }, [isLoggedIn]);

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
      <Menu
        onOpen={() => handleNotificationMenuToggle(true)}
        onClose={() => handleNotificationMenuToggle(false)}
      >
        <MenuButton p="0px" position="relative">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
          {unreadCount > 0 && (
            <Box
              position="absolute"
              top="-2px"
              right="8px"
              bg="red.500"
              color="white"
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              minW="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px="4px"
              animation="pulse 2s infinite"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Box>
          )}
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
          maxH="500px"
          overflowY="auto"
        >
          <Flex w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notifikasi
              {unreadCount > 0 && (
                <Text as="span" color="red.500" fontSize="sm" ml={2}>
                  ({unreadCount} baru)
                </Text>
              )}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
              onClick={markAllAsRead}
              _hover={{ textDecoration: 'underline' }}
            >
              Tandai semua dibaca
            </Text>
          </Flex>
          <Flex flexDirection="column">
            {notifications.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py="40px"
                color={textGray}
              >
                <Icon as={MdNotificationsNone} w="40px" h="40px" mb={2} />
                <Text fontSize="sm">Belum ada notifikasi</Text>
              </Flex>
            ) : (
              notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  _hover={{ bg: menuBgHovered }}
                  _focus={{ bg: 'none' }}
                  px="12px"
                  py="12px"
                  borderRadius="8px"
                  mb="8px"
                  bg={notification.isRead ? 'transparent' : bgMenuItem}
                  borderLeft={notification.isRead ? 'none' : '4px solid'}
                  borderColor={notification.isRead ? 'transparent' : 'blue.500'}
                >
                  <Flex direction="column" w="100%">
                    <Flex justify="space-between" align="start" mb={1}>
                      <Text
                        fontSize="sm"
                        fontWeight={notification.isRead ? '500' : '700'}
                        color={textColor}
                        lineHeight="1.2"
                      >
                        {notification.title}
                      </Text>
                      <Text
                        fontSize="xs"
                        color={textGray}
                        ml={2}
                        flexShrink={0}
                      >
                        {formatTime(notification.timestamp)}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="xs"
                      color={textGray}
                      mb={2}
                      lineHeight="1.3"
                    >
                      {notification.message}
                    </Text>
                    <Flex justify="space-between" align="center">
                      <Text fontSize="xs" color={textGray}>
                        {notification.orderCode}
                      </Text>
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        color={getStatusColor(notification.status)}
                        bg={bgNotif}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {notification.status}
                      </Text>
                    </Flex>
                  </Flex>
                </MenuItem>
              ))
            )}
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

            {/* Informasi Total Pengunjung Hari Ini */}
            <Stat mb={4}>
              <StatLabel
                fontSize="lg"
                fontWeight="bold"
                mb={2}
                color={textColor}
              >
                Total Pengunjung Hari Ini
              </StatLabel>
              <StatNumber fontSize="3xl" color={statColor}>
                {visitorStats.todayVisitors}
              </StatNumber>
              <StatHelpText fontSize="sm" color="gray.500">
                Data pengunjung hari ini (realtime)
              </StatHelpText>
            </Stat>

            {/* Informasi Total Semua Pengunjung */}
            <Stat mb={4}>
              <StatLabel
                fontSize="lg"
                fontWeight="bold"
                mb={2}
                color={textColor}
              >
                Total Semua Pengunjung
              </StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {visitorStats.totalVisitors}
              </StatNumber>
              <StatHelpText fontSize="sm" color="gray.500">
                Akumulasi seluruh pengunjung
              </StatHelpText>
            </Stat>

            {/* Informasi IP Unik */}
            {/* <Stat mb={4}>
              <StatLabel
                fontSize="lg"
                fontWeight="bold"
                mb={2}
                color={textColor}
              >
                IP Address Unik
              </StatLabel>
              <StatNumber fontSize="2xl" color="orange.500">
                {visitorStats.uniqueIPs}
              </StatNumber>
              <StatHelpText fontSize="sm" color="gray.500">
                Jumlah IP address yang berbeda
              </StatHelpText>
            </Stat> */}

            {/* Informasi Orders Hari Ini */}
            <Stat>
              <StatLabel
                fontSize="lg"
                fontWeight="bold"
                mb={2}
                color={textColor}
              >
                Pesanan Hari Ini
              </StatLabel>
              <StatNumber fontSize="3xl" color="green.500">
                {todayOrders.length}
              </StatNumber>
              <StatHelpText fontSize="sm" color="gray.500">
                Total pesanan yang masuk hari ini (realtime)
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
                color="red.400"
                borderRadius="8px"
                px="14px"
                bg={menuBg}
                onClick={() => {
                  if (isLoggedIn) {
                    localStorage.clear();
                    setIsLoggedIn(false);
                    window.location.reload();
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
