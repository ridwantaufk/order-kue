/* eslint-disable */

import {
  Box,
  Flex,
  Icon,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
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
} from 'react-icons/md';
import { io } from 'socket.io-client';
import { DateTime } from 'luxon';

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const [orders, setOrders] = React.useState([]);
  const [sorting, setSorting] = React.useState([
    { id: 'status', asc: true },
    { id: 'updated_at', desc: true },
  ]);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [extraTime, setExtraTime] = React.useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Get today's date

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
      } else if (process.env.REACT_APP_BACKEND_URL.includes('ngrok')) {
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
      setOrders(filterOrdersByDate(initialDataOrders));
    });

    socket.on('ordersUpdate', (updatedDataOrders) => {
      setOrders(filterOrdersByDate(updatedDataOrders));
    });

    return () => socket.disconnect();
  }, []);

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

        const handleStatusClick = () => {
          if (row.status === 'Menunggu') {
            axios
              .put(
                `${process.env.REACT_APP_BACKEND_URL}/api/orders/${row.order_id}`,
                {
                  status: 'Sedang Diproses',
                },
              )
              .then(() => {})
              .catch((error) => console.error('Error updating status:', error));
          } else if (row.status === 'Sedang Diproses') {
            axios
              .put(
                `${process.env.REACT_APP_BACKEND_URL}/api/orders/${row.order_id}`,
                {
                  status: 'Selesai',
                },
              )
              .then(() => {})
              .catch((error) => console.error('Error updating status:', error));
          }
        };

        return (
          <Flex align="center" onClick={handleStatusClick} cursor="pointer">
            <Icon
              w="24px"
              h="24px"
              me="5px"
              color={
                row.status === 'Selesai'
                  ? 'green.500'
                  : row.status === 'Sedang Diproses'
                  ? 'blue.500'
                  : row.status === 'Menunggu'
                  ? 'gray.500'
                  : null
              }
              as={
                row.status === 'Selesai'
                  ? MdCheckCircle
                  : row.status === 'Sedang Diproses'
                  ? MdHourglassEmpty
                  : row.status === 'Menunggu'
                  ? MdAccessTime
                  : null
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
    columnHelper.accessor('progress', {
      id: 'progress',
      header: () => (
        <Text color="gray.400" fontSize={{ sm: '10px', lg: '12px' }}>
          PROGRESS
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original;
        const [elapsedTime, setElapsedTime] = React.useState(0);
        const [showPrompt, setShowPrompt] = React.useState(false); // State lokal untuk setiap baris
        const totalTime = 60 * 1000; // Total time (60 seconds)

        // Ambil waktu dari kolom updated_at
        const updatedAt = new Date(row.updated_at);

        React.useEffect(() => {
          if (row.status === 'Sedang Diproses') {
            const interval = setInterval(() => {
              const currentTime = new Date();
              const timeDifference = currentTime - updatedAt; // Selisih waktu antara updated_at dan waktu sekarang

              // Hitung waktu yang telah berlalu (elapsedTime)
              const newElapsedTime = Math.min(timeDifference, totalTime); // Jangan lebih dari totalTime
              setElapsedTime(newElapsedTime);

              // Jika waktu sudah habis, berhenti menghitung mundur dan tampilkan prompt
              if (newElapsedTime >= totalTime) {
                clearInterval(interval);
                setShowPrompt(true); // Tampilkan prompt hanya untuk baris yang sesuai
              }
            }, 1000);
            return () => clearInterval(interval); // Bersihkan interval ketika komponen dibersihkan
          } else if (row.status === 'Selesai') {
            setElapsedTime(totalTime); // Jika selesai, set waktu ke totalTime untuk progres 100%
          }
        }, [row.status, updatedAt]);

        // Hitung persentase progres berdasarkan waktu yang telah berlalu
        const progressPercent = Math.round((elapsedTime / totalTime) * 100);
        const remainingTime = totalTime - elapsedTime;
        const minutesLeft = String(
          Math.floor(remainingTime / (60 * 1000)),
        ).padStart(2, '0');
        const secondsLeft = String(
          Math.floor((remainingTime % (60 * 1000)) / 1000),
        ).padStart(2, '0');

        const handleAddExtraTime = () => {
          setShowPrompt(false); // Menyembunyikan prompt setelah menambah waktu
        };

        const handleFinishOrder = () => {
          setShowPrompt(false);

          axios
            .put(
              `${process.env.REACT_APP_BACKEND_URL}/api/orders/${row.order_id}`,
              {
                status: 'Selesai',
              },
            )
            .then(() => {})
            .catch((error) => console.error('Error finishing order:', error));
        };

        return (
          <Flex direction="column" align="center" w="120px">
            <Progress
              variant="table"
              colorScheme="brandScheme"
              h="8px"
              w="100%"
              value={progressPercent} // Persentase progres berdasarkan waktu yang telah berlalu
            />
            {row.status === 'Sedang Diproses' && (
              <>
                {showPrompt ? (
                  <Flex direction="column" align="center" justify="center">
                    <Text fontSize="sm" fontWeight="bold" color="red.500">
                      Estimasi habis! Pesanan sudah selesai ?
                    </Text>
                    <Box mt="2">
                      <Icon
                        as={MdCheckCircle}
                        w="24px"
                        h="24px"
                        color="green.500"
                        cursor="pointer"
                        onClick={handleFinishOrder}
                      />
                      <Icon
                        as={MdCancel}
                        w="24px"
                        h="24px"
                        color="red.500"
                        cursor="pointer"
                        onClick={handleAddExtraTime}
                      />
                    </Box>
                  </Flex>
                ) : (
                  <Text fontSize="sm" fontWeight="700" color={textColor}>
                    {minutesLeft}:{secondsLeft}
                  </Text>
                )}
              </>
            )}
          </Flex>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: orders, // Use orders data from state
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX="scroll">
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
            {table
              .getRowModel()
              .rows.slice(0, 11)
              .map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
