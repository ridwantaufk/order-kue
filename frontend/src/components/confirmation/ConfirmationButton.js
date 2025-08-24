import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Icon,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { DateTime } from 'luxon';

const ConfirmationButton = () => {
  const [deliverableOrders, setDeliverableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Get order codes from localStorage
    const orderCodesFromStorage = localStorage.getItem('order_code');
    if (!orderCodesFromStorage || orderCodesFromStorage === 'null') {
      setLoading(false);
      setDeliverableOrders([]);
      return;
    }

    const orderCodes = orderCodesFromStorage.split(',');

    // Setup socket connection (same as ComplexTable)
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: { 'ngrok-skip-browser-warning': 'true' },
    });

    const today = DateTime.now().setZone('Asia/Jakarta').toISODate();

    const filterAndSetDeliverableOrders = (ordersData) => {
      console.log('ConfirmationButton - Raw orders data:', ordersData);
      console.log('ConfirmationButton - Order codes to match:', orderCodes);
      console.log('ConfirmationButton - Today date:', today);

      // Filter by date (same logic as ComplexTable)
      let filteredByDate;
      if (process.env.REACT_APP_BACKEND_URL.includes('railway')) {
        filteredByDate = ordersData.filter((order) => {
          const orderDate = DateTime.fromISO(order.updated_at)
            .toUTC()
            .toISODate();
          console.log(
            `Order ${
              order.order_code
            }: orderDate=${orderDate}, today=${today}, match=${
              orderDate === today
            }`,
          );
          return orderDate === today;
        });
      } else {
        filteredByDate = ordersData.filter((order) => {
          const orderDate = DateTime.fromISO(order.updated_at, {
            zone: 'Asia/Jakarta',
          }).toISODate();
          console.log(
            `Order ${
              order.order_code
            }: orderDate=${orderDate}, today=${today}, match=${
              orderDate === today
            }`,
          );
          return orderDate === today;
        });
      }

      console.log('ConfirmationButton - Filtered by date:', filteredByDate);

      // Filter by order codes and status "Sedang dikirim"
      const deliverable = filteredByDate.filter((order) => {
        const orderIdMatch = orderCodes.includes(String(order.order_id));
        const orderCodeMatch = orderCodes.includes(order.order_code);
        const statusMatch = order.status === 'Sedang dikirim';

        console.log(`Order ${order.order_code} (ID: ${order.order_id}):`, {
          orderIdMatch,
          orderCodeMatch,
          statusMatch,
          status: order.status,
          willInclude: (orderIdMatch || orderCodeMatch) && statusMatch,
        });

        return (orderIdMatch || orderCodeMatch) && statusMatch;
      });

      console.log(
        'ConfirmationButton - Final deliverable orders:',
        deliverable,
      );
      setDeliverableOrders(deliverable);
      if (loading) {
        setLoading(false);
      }
    };

    // Listen to socket events
    socket.on('initialOrders', (initialDataOrders) => {
      console.log('ConfirmationButton - initialOrders:', initialDataOrders);
      filterAndSetDeliverableOrders(initialDataOrders);
    });

    socket.on('ordersUpdate', (updatedDataOrders) => {
      console.log('ConfirmationButton - ordersUpdate:', updatedDataOrders);
      filterAndSetDeliverableOrders(updatedDataOrders);
    });

    // Handle storage changes
    const handleStorageChange = () => {
      const newOrderCodes = localStorage.getItem('order_code');
      if (newOrderCodes !== orderCodesFromStorage) {
        // Restart the component logic with new order codes
        window.location.reload(); // Simple approach, or you can implement more sophisticated logic
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      socket.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loading]);

  const handleConfirm = async (orderId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`,
        {
          status: 'Diterima',
        },
      );

      toast({
        title: 'Pesanan Diterima',
        description: 'Terima kasih telah mengkonfirmasi pesanan Anda!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Remove from local state
      setDeliverableOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== orderId),
      );

      // Close modal if no more orders
      if (deliverableOrders.length === 1) {
        onClose();
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengkonfirmasi pesanan.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Debug logs
  console.log('ConfirmationButton Debug:', {
    loading,
    orderCodesFromStorage: localStorage.getItem('order_code'),
    deliverableOrdersLength: deliverableOrders.length,
    deliverableOrders: deliverableOrders,
  });

  if (loading) {
    return (
      <Box position="fixed" bottom="4" right="24" zIndex="50">
        <Spinner color="green.500" />
      </Box>
    );
  }

  // Always show debug info in development
  // if (process.env.NODE_ENV === 'development') {
  //   return (
  //     <>
  //       {/* Debug Panel */}
  //       <Box
  //         position="fixed"
  //         top="4"
  //         right="4"
  //         bg="yellow.100"
  //         p={3}
  //         borderRadius="md"
  //         fontSize="xs"
  //         maxW="300px"
  //         zIndex="100"
  //       >
  //         <Text fontWeight="bold">ConfirmationButton Debug:</Text>
  //         <Text>Order Codes: {localStorage.getItem('order_code')}</Text>
  //         <Text>Loading: {loading.toString()}</Text>
  //         <Text>Deliverable Orders: {deliverableOrders.length}</Text>
  //         <Text>
  //           Orders:{' '}
  //           {JSON.stringify(
  //             deliverableOrders.map((o) => ({
  //               id: o.order_id,
  //               status: o.status,
  //               code: o.order_code,
  //             })),
  //             null,
  //             2,
  //           )}
  //         </Text>
  //       </Box>

  //       {/* Original button logic */}
  //       {deliverableOrders.length > 0 && (
  //         <Box position="fixed" bottom="4" right="24" zIndex="50">
  //           <Button
  //             onClick={onOpen}
  //             colorScheme="green"
  //             borderRadius="full"
  //             w={{ base: '60px', md: 'auto' }}
  //             h="60px"
  //             px={{ base: 0, md: '20px' }}
  //             boxShadow="lg"
  //             aria-label="Konfirmasi Pesanan Diterima"
  //           >
  //             <Icon as={MdCheckCircle} w={6} h={6} mr={{ base: 0, md: 2 }} />
  //             <Text display={{ base: 'none', md: 'block' }}>
  //               Konfirmasi Diterima ({deliverableOrders.length})
  //             </Text>
  //           </Button>
  //         </Box>
  //       )}
  //     </>
  //   );
  // }

  if (deliverableOrders.length === 0) {
    return null;
  }

  return (
    <>
      <Box position="fixed" bottom="4" right="24" zIndex="50">
        <Button
          onClick={onOpen}
          colorScheme="green"
          borderRadius="full"
          w={{ base: '60px', md: 'auto' }}
          h="60px"
          px={{ base: 0, md: '20px' }}
          boxShadow="lg"
          aria-label="Konfirmasi Pesanan Diterima"
        >
          <Icon as={MdCheckCircle} w={6} h={6} mr={{ base: 0, md: 2 }} />
          <Text display={{ base: 'none', md: 'block' }}>
            Konfirmasi Diterima ({deliverableOrders.length})
          </Text>
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Konfirmasi Pesanan Diterima</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {deliverableOrders.map((order) => (
                <Box
                  key={order.order_id}
                  w="100%"
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <HStack justifyContent="space-between">
                    <VStack align="start">
                      <Text fontWeight="bold">{order.order_code}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {order.OrderItems && order.OrderItems.length > 0
                          ? order.OrderItems.map(
                              (item) =>
                                item.product?.product_name || 'Produk Dihapus',
                            ).join(', ')
                          : 'Pesanan'}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {order.customer_name}
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="green"
                      leftIcon={<Icon as={MdCheckCircle} />}
                      onClick={() => handleConfirm(order.order_id)}
                    >
                      Diterima
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationButton;
