/* eslint-disable */

import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Divider,
  Link,
  useToast,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import * as React from 'react';
import axios from 'axios';
import {
  MdCancel,
  MdCheckCircle,
  MdAccessTime,
  MdHourglassEmpty,
  MdLocalShipping,
  MdCheck,
  MdLocationOn,
  MdPhone,
  MdCalendarToday,
  MdDevices,
  MdOpenInNew,
  MdMap,
} from 'react-icons/md';
import { io } from 'socket.io-client';
import { DateTime } from 'luxon';
import { useSearchStore } from 'components/search/searchStore';

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const toast = useToast();
  const [orders, setOrders] = React.useState([]);
  const [sorting, setSorting] = React.useState([
    // { id: 'status', asc: true },
    { id: 'updated_at', desc: true },
  ]);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'gray.800');
  const grayText = useColorModeValue('gray.600', 'gray.400');

  const statusMap = {
    Menunggu: 'Sedang diproses',
    'Sedang diproses': 'Sedang dikirim',
    'Sedang dikirim': 'Diterima',
  };

  const statusColors = {
    Menunggu: 'gray',
    'Sedang diproses': 'blue',
    'Sedang dikirim': 'orange',
    Diterima: 'green',
    Batal: 'red',
  };

  React.useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: { 'ngrok-skip-browser-warning': 'true' },
    });

    const today = DateTime.now().setZone('Asia/Jakarta').toISODate();

    const filterOrdersByDate = (ordersData) => {
      if (process.env.REACT_APP_BACKEND_URL.includes('railway')) {
        return ordersData
          .filter((order) => {
            const orderDate = DateTime.fromISO(order.updated_at)
              .toUTC()
              .toISODate();
            return orderDate === today;
          })
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      } else if (
        process.env.REACT_APP_BACKEND_URL.includes('ngrok') ||
        process.env.REACT_APP_BACKEND_URL
      ) {
        return ordersData
          .filter((order) => {
            const orderDate = DateTime.fromISO(order.updated_at, {
              zone: 'Asia/Jakarta',
            }).toISODate();
            return orderDate === today;
          })
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      }
    };

    socket.on('initialOrders', (initialDataOrders) => {
      console.log('initialDataOrders:', initialDataOrders);
      setOrders(filterOrdersByDate(initialDataOrders));
    });

    socket.on('ordersUpdate', (updatedDataOrders) => {
      console.log('updatedDataOrders:', updatedDataOrders);
      setOrders(filterOrdersByDate(updatedDataOrders));
    });

    return () => socket.disconnect();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const columns = [
    columnHelper.accessor('order_code', {
      id: 'order_code',
      header: () => (
        <Text color="gray.400" fontSize={{ sm: '10px', lg: '12px' }}>
          ORDER CODE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('customer_name', {
      id: 'customer_name',
      header: () => (
        <Text color="gray.400" fontSize={{ sm: '10px', lg: '12px' }}>
          CUSTOMER NAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text color="gray.400" fontSize={{ sm: '10px', lg: '12px' }}>
          STATUS
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original;

        const handleStatusClick = (e) => {
          e.stopPropagation(); // Prevent row click event

          if (row.status === 'Menunggu') {
            setSelectedOrderId(row.order_id);
            setSelectedOrder(row);
            setShowConfirm(true);
            return;
          }

          updateStatus(statusMap[row.status]);
        };

        const updateStatus = (nextStatus) => {
          axios
            .put(
              `${process.env.REACT_APP_BACKEND_URL}/api/orders/${row.order_id}`,
              {
                status: nextStatus,
              },
            )
            .then((res) => {
              console.log('Status updated:', res.data.status);
              if (res.data.status === 'Diterima') {
                socket.emit('order_status_changed', {
                  orderId,
                  newStatus: res.data.status,
                });
              }
            })
            .catch((error) => console.error('Error updating status:', error));
        };

        return (
          <Flex
            align="center"
            _hover={{ bg: 'gray.300' }}
            rounded={'lg'}
            transition={'background-color 0.2s ease-in-out'}
            padding="3px"
            onClick={
              row.status !== 'Batal' && row.status !== 'Diterima'
                ? handleStatusClick
                : () => {}
            }
            cursor={
              row.status !== 'Batal' && row.status !== 'Diterima'
                ? 'pointer'
                : 'default'
            }
            gap={1}
          >
            <Icon
              w="24px"
              h="24px"
              me="5px"
              color={
                {
                  Menunggu: 'gray.500',
                  'Sedang diproses': 'blue.500',
                  'Sedang dikirim': 'orange.500',
                  Diterima: 'green.500',
                  Batal: 'red.500',
                }[row.status] ?? 'red.500'
              }
              as={
                {
                  Menunggu: MdAccessTime,
                  'Sedang diproses': MdHourglassEmpty,
                  'Sedang dikirim': MdLocalShipping,
                  Diterima: MdCheckCircle,
                  Batal: MdCancel,
                }[row.status] ?? MdHourglassEmpty
              }
            />
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {row.status}
            </Text>
          </Flex>
        );
      },
    }),

    columnHelper.accessor('created_at', {
      id: 'created_at',
      header: () => (
        <Text color="gray.400" fontSize={{ sm: '10px', lg: '12px' }}>
          CREATED AT
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleString()}
        </Text>
      ),
    }),
    columnHelper.accessor('time_elapsed', {
      id: 'time_elapsed',
      header: () => (
        <Text color="gray.400" fontSize={{ sm: '10px', lg: '12px' }}>
          TIME ELAPSED
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original;
        const [elapsedTime, setElapsedTime] = React.useState(0);
        const [rowStats, setRowStats] = React.useState(null);

        // Ambil waktu mulai dari updated_at (saat status jadi "Sedang diproses")
        const startedAt = new Date(row.updated_at).getTime();

        React.useEffect(() => {
          const isRunning =
            row.status === 'Sedang diproses' || row.status === 'Sedang dikirim';

          if (!isRunning) return;
          setRowStats(isRunning);

          const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - startedAt;
            setElapsedTime(diff);
          }, 1000);

          return () => clearInterval(interval);
        }, [row.status, startedAt]);

        // Konversi elapsedTime ke HH:MM:SS
        const hours = String(Math.floor(elapsedTime / 3600000)).padStart(
          2,
          '0',
        );
        const minutes = String(
          Math.floor((elapsedTime % 3600000) / 60000),
        ).padStart(2, '0');
        const seconds = String(
          Math.floor((elapsedTime % 60000) / 1000),
        ).padStart(2, '0');

        return (
          <Flex direction="column" align="center" w="120px">
            <Text fontSize="sm" fontWeight="700" color="teal.500">
              {rowStats ? `${hours}:${minutes}:${seconds}` : '-'}
            </Text>
          </Flex>
        );
      },
    }),
  ];

  React.useEffect(() => {
    console.log('orders hasill :', orders);
  }, [orders]);

  const filteredOrders = React.useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const code = order.order_code?.toLowerCase() || '';
      const name = order.customer_name?.toLowerCase() || '';
      return code.includes(term) || name.includes(term);
    });
  }, [orders, searchTerm]);

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX="scroll">
      {/* Modal Konfirmasi Status */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent zIndex="modal" borderRadius="xl" shadow="lg">
          <ModalHeader fontSize="lg" fontWeight="bold">
            Konfirmasi
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Apakah Anda yakin ingin memproses pesanan ini?</Text>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center" gap={8}>
            <Button
              leftIcon={<MdCheck />}
              colorScheme="blue"
              onClick={async () => {
                if (!selectedOrder) {
                  toast({
                    title: 'Error',
                    description: 'Data pesanan tidak ditemukan',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                  setShowConfirm(false);
                  return;
                }

                // console.log('selectedOrder:', selectedOrder);

                try {
                  await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/products/0`,
                    {
                      decreaseStock: true,
                      items: selectedOrder.OrderItems.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                      })),
                    },
                  );

                  await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/orders/${selectedOrderId}`,
                    { status: statusMap['Menunggu'] },
                  );

                  toast({
                    title: 'Berhasil',
                    description: 'Pesanan berhasil diproses',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                } catch (error) {
                  let errMessage = 'Gagal memproses pesanan';
                  console.error('Error updating status:', error);
                  if (error?.response?.data?.message) {
                    errMessage = `${error.response.data.message}`;
                  }

                  toast({
                    title: 'Error',
                    description: (
                      <Box
                        whiteSpace="pre-line"
                        dangerouslySetInnerHTML={{ __html: errMessage }}
                      />
                    ),
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                  });
                } finally {
                  setShowConfirm(false);
                }
              }}
            >
              Lanjutkan
            </Button>

            <Button
              leftIcon={<MdCancel />}
              colorScheme="red"
              onClick={() => {
                axios
                  .put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/orders/${selectedOrderId}`,
                    {
                      status: 'Batal',
                    },
                  )
                  .then(() => {
                    toast({
                      title: 'Berhasil',
                      description: 'Pesanan berhasil dibatalkan',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch((error) => {
                    console.error('Error cancelling order:', error);
                    toast({
                      title: 'Error',
                      description: 'Gagal membatalkan pesanan',
                      status: 'error',
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .finally(() => {
                    setShowConfirm(false);
                  });
              }}
            >
              Batalkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Detail Order */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        size="2xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          zIndex="modal"
          borderRadius="xl"
          shadow="lg"
          maxW="800px"
          bg={cardBg}
          maxH="calc(100vh - 50px)"
          overflow="auto"
        >
          <ModalHeader fontSize="xl" fontWeight="bold" color={textColor}>
            Detail Pemesanan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedOrder && (
              <VStack spacing={6} align="stretch">
                {/* Order Info Section */}
                <Box>
                  <HStack justify="space-between" mb={4}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {selectedOrder.order_code}
                      </Text>
                      <Badge
                        colorScheme={statusColors[selectedOrder.status]}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {selectedOrder.status}
                      </Badge>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Text fontSize="sm" color={grayText}>
                        Order ID: {selectedOrder.order_id}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Divider />

                {/* Customer Info Section */}
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    mb={3}
                    color={textColor}
                  >
                    Informasi Pelanggan
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Icon as={MdLocationOn} color="blue.500" />
                      <Box>
                        <Text fontWeight="semibold" color={textColor}>
                          {selectedOrder.customer_name}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack>
                      <Icon as={MdPhone} color="green.500" />
                      <Text color={textColor}>
                        {selectedOrder.customer_phone}
                      </Text>
                    </HStack>

                    <HStack align="start">
                      <Icon as={MdLocationOn} color="red.500" mt={1} />
                      <Box>
                        <Text color={textColor}>
                          {selectedOrder.customer_address}
                        </Text>
                        {selectedOrder.location_latitude &&
                          selectedOrder.location_longitude && (
                            <Text fontSize="sm" color={grayText} mt={1}>
                              Koordinat: {selectedOrder.location_latitude},{' '}
                              {selectedOrder.location_longitude}
                            </Text>
                          )}
                      </Box>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                {/* Date Info Section */}
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    mb={3}
                    color={textColor}
                  >
                    Informasi Waktu
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Icon as={MdCalendarToday} color="purple.500" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" color={textColor}>
                          Tanggal Order:
                        </Text>
                        <Text color={grayText} fontSize="sm">
                          {new Date(selectedOrder.order_date).toLocaleString(
                            'id-ID',
                          )}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack>
                      <Icon as={MdCalendarToday} color="blue.500" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" color={textColor}>
                          Dibuat:
                        </Text>
                        <Text color={grayText} fontSize="sm">
                          {new Date(selectedOrder.created_at).toLocaleString(
                            'id-ID',
                          )}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack>
                      <Icon as={MdCalendarToday} color="orange.500" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" color={textColor}>
                          Terakhir Update:
                        </Text>
                        <Text color={grayText} fontSize="sm">
                          {new Date(selectedOrder.updated_at).toLocaleString(
                            'id-ID',
                          )}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  {/* Judul utama */}
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    mb={4}
                    color={textColor}
                  >
                    Detail Pesanan
                  </Text>

                  {/* List Item Pesanan */}
                  <Box mb={6}>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      mb={3}
                      color={textColor}
                    >
                      Daftar Produk
                    </Text>

                    {selectedOrder.OrderItems.map((item) => (
                      <HStack
                        key={item.order_item_id}
                        justify="space-between"
                        bg="gray.50"
                        p={3}
                        borderRadius="md"
                        alignItems="center"
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium" color={textColor}>
                            {item.product?.product_name ??
                              `Produk ID: ${item.product_id}`}
                          </Text>
                          <Text color={grayText}>Qty: {item.quantity}</Text>
                        </VStack>

                        <Text fontWeight="semibold" color={textColor}>
                          Rp {Number(item.price).toLocaleString('id-ID')}
                        </Text>
                      </HStack>
                    ))}
                  </Box>

                  {/* Ringkasan Total */}
                  <Box>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      mb={3}
                      color={textColor}
                    >
                      Ringkasan Pesanan
                    </Text>

                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="medium" color={grayText}>
                        Total Item
                      </Text>
                      <Text fontWeight="semibold" color={textColor}>
                        {selectedOrder.OrderItems.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}{' '}
                        item
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontWeight="medium" color={grayText}>
                        Total Harga
                      </Text>
                      <Text fontWeight="bold" fontSize="lg" color={textColor}>
                        Rp{' '}
                        {selectedOrder.OrderItems.reduce(
                          (total, item) => total + Number(item.price),
                          0,
                        ).toLocaleString('id-ID')}
                      </Text>
                    </HStack>
                  </Box>
                </Box>

                {/* Informasi Perangkat */}
                <Box mb={6}>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    mb={3}
                    color={textColor}
                  >
                    Informasi Perangkat
                  </Text>
                  <HStack align="start">
                    <Icon as={MdDevices} color="gray.500" mt={1} />
                    <Text color={grayText} fontSize="sm" lineHeight="1.4">
                      {selectedOrder.device_info}
                    </Text>
                  </HStack>
                </Box>

                {/* Maps Section */}
                {(selectedOrder.location_latitude &&
                  selectedOrder.location_longitude) ||
                selectedOrder.customer_address ? (
                  <>
                    <Divider />
                    <Box>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        mb={3}
                        color={textColor}
                      >
                        Lokasi
                      </Text>
                      <VStack spacing={3}>
                        {selectedOrder.location_latitude &&
                        selectedOrder.location_longitude ? (
                          <Box
                            w="100%"
                            h="200px"
                            bg="gray.100"
                            borderRadius="md"
                            overflow="hidden"
                          >
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              src={`https://maps.google.com/maps?q=${selectedOrder.location_latitude},${selectedOrder.location_longitude}&z=15&output=embed`}
                              title="Location Map"
                            />
                          </Box>
                        ) : (
                          <Box
                            w="100%"
                            h="200px"
                            bg="gray.100"
                            borderRadius="md"
                            overflow="hidden"
                          >
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                selectedOrder.customer_address,
                              )}&z=15&output=embed`}
                              title="Location Map"
                            />
                          </Box>
                        )}

                        <Button
                          leftIcon={<MdMap />}
                          rightIcon={<MdOpenInNew />}
                          colorScheme="blue"
                          size="md"
                          onClick={() => {
                            const query =
                              selectedOrder.location_latitude &&
                              selectedOrder.location_longitude
                                ? `${selectedOrder.location_latitude},${selectedOrder.location_longitude}`
                                : selectedOrder.customer_address;
                            window.open(
                              `https://www.google.com/maps?q=${encodeURIComponent(
                                query,
                              )}`,
                              '_blank',
                            );
                          }}
                          w="full"
                        >
                          Buka di Google Maps
                        </Button>
                      </VStack>
                    </Box>
                  </>
                ) : null}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Tabel Order
        </Text>
        <Menu />
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() && (
                        <span>
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                cursor="pointer"
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
