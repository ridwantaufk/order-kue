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
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { DateTime } from 'luxon';

const columnHelper = createColumnHelper();

export default function Antrian() {
  const [orders, setOrders] = useState([]);
  const [sorting, setSorting] = useState([
    { id: 'status', asc: true },
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

        if (status === 'Selesai') {
          colorScheme = 'green';
        } else if (status === 'Menunggu') {
          colorScheme = 'blue';
        }

        return (
          <Tag
            size="sm"
            variant="solid"
            colorScheme={colorScheme}
            borderRadius="full"
          >
            <TagLabel>{status}</TagLabel>
          </Tag>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: orders,
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
                    p="16px"
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
