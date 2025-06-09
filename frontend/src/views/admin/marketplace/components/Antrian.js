/* eslint-disable */

import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Tag,
  TagLabel,
  Img,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import { DateTime } from 'luxon';
import { useSearchStore } from 'components/search/searchStore';

const columnHelper = createColumnHelper();

export default function Antrian() {
  const [orders, setOrders] = useState([]);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const [sorting, setSorting] = useState([
    // { id: 'status', desc: true },
    { id: 'updated_at', desc: true },
  ]);

  // Color schemes for different table states
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const evenRowBackground = useColorModeValue('white', 'gray.700');
  const oddRowBackground = useColorModeValue('gray.200', 'navy.700');
  const hoverBackground = useColorModeValue('blue.100', 'blue.900');
  const borderColor = useColorModeValue('gray.200', 'navy.700');

  // Fetch orders using socket.io
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: { 'ngrok-skip-browser-warning': 'true' },
    });

    socket.on('connect', () => console.log('Connected to Socket.IO server'));

    // Filter orders by today's date
    const filterOrdersByDate = (ordersData) => {
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
      // console.log('initialOrders:', initialDataOrders);
      setOrders(filterOrdersByDate(initialDataOrders));
    });

    socket.on('ordersUpdate', (updatedDataOrders) => {
      // console.log('ordersUpdate:', updatedDataOrders);
      setOrders(filterOrdersByDate(updatedDataOrders));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    console.log('Orders updated:', orders);
  }, []);

  const columns = [
    columnHelper.accessor('order_code', {
      header: () => (
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.400"
          textAlign="center"
        >
          Order Code
        </Text>
      ),
      cell: (info) => (
        <Text fontSize={{ base: 'xs', md: 'sm' }} color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('customer_name', {
      header: () => (
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.400"
          textAlign="center"
        >
          Customer Name
        </Text>
      ),
      cell: (info) => (
        <Text fontSize={{ base: 'xs', md: 'sm' }} color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => (
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.400"
          textAlign="center"
        >
          Status
        </Text>
      ),
      cell: (info) => {
        const status = info.getValue();
        let colorScheme;
        let iconStatus;

        switch (status) {
          case 'Menunggu':
            colorScheme = 'gray';
            iconStatus = '/assets/img/animations/payment.gif';
            break;
          case 'Sedang diproses':
            colorScheme = 'blue';
            iconStatus = '/assets/img/animations/cooking.gif';
            break;
          case 'Sedang dikirim':
            colorScheme = 'orange';
            iconStatus = '/assets/img/animations/delivery-scooter.gif';
            break;
          case 'Diterima':
            colorScheme = 'green';
            iconStatus = '/assets/img/animations/received-delivery.gif';
            break;
          case 'Batal':
            colorScheme = 'red';
            iconStatus = '/assets/img/animations/cancelled.gif';
            break;
          default:
            colorScheme = 'red';
            iconStatus = '';
        }

        return (
          <Tag
            size="md"
            variant="solid"
            colorScheme={colorScheme}
            borderRadius="full"
            fontSize={{
              base: 'x-small',
              md: 'x-small',
              lg: 'x-small',
            }}
          >
            <Img src={iconStatus} className="w-5 h-5" alt="payment" />
            <TagLabel>{status}</TagLabel>
          </Tag>
        );
      },
    }),
  ];

  const filteredOrders = useMemo(() => {
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
  });

  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          Antrian
        </Text>
      </Flex>
      <Box maxH="calc(100vh - 250px)" overflowY="auto" w="100%">
        <Table
          variant="simple"
          color={useColorModeValue('gray.600', 'gray.300')}
          mt="12px"
          fontSize={{ base: 'xs', md: 'sm' }}
          sx={{ tableLayout: 'fixed' }}
          width="100%"
        >
          <Thead
            position="sticky"
            top="0"
            zIndex="1"
            backdropFilter="blur(4px)"
            bg={useColorModeValue(
              'rgba(255, 255, 255, 0.9)', // Light mode
              'navy.850', // Dark mode
            )}
            borderBottom="1px solid"
            borderColor={useColorModeValue('gray.200', 'navy.700')}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    borderColor={useColorModeValue('gray.200', 'navy.700')}
                    onClick={header.column.getToggleSortingHandler()}
                    cursor="pointer"
                    color={useColorModeValue('gray.600', 'gray.300')}
                    fontWeight="bold"
                    fontSize={{ base: 'xx-small', md: 'xl' }}
                    whiteSpace="normal"
                    overflowWrap="break-word"
                  >
                    <Flex justify="space-between" align="center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted()] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row, index) => (
              <Tr
                key={row.id}
                bg={index % 2 === 0 ? evenRowBackground : oddRowBackground}
                _hover={{ bg: hoverBackground }}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    borderColor={borderColor}
                    p="10px"
                    fontSize={{ base: 'xx-small', md: 'sm' }}
                    whiteSpace="normal"
                    overflowWrap="break-word"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
