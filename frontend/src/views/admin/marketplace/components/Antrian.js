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
import axios from 'axios';
import io from 'socket.io-client';

const columnHelper = createColumnHelper();

export default function Antrian() {
  const [orders, setOrders] = useState([]);
  const [sorting, setSorting] = useState([{ id: 'created_at', desc: true }]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const tagColor = useColorModeValue('blue.100', 'blue.700');
  const tagColorGreen = useColorModeValue('green.100', 'green.700');

  const SOCKET_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('orderUpdate', (newOrderData) => {
      setOrders(newOrderData);
    });

    return () => socket.disconnect();
  }, []);

  const columns = [
    columnHelper.accessor('order_code', {
      header: () => (
        <Text fontSize="sm" color="gray.400" textAlign="center">
          Order Code
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('customer_name', {
      header: () => (
        <Text fontSize="sm" color="gray.400" textAlign="center">
          Customer Name
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: () => (
        <Text fontSize="sm" color="gray.400" textAlign="center">
          Status
        </Text>
      ),
      cell: (info) => {
        const orderTime = new Date(info.getValue());
        const currentTime = new Date();
        const timeDiff = (currentTime - orderTime) / 60000; // Difference in minutes

        let status = 'Menunggu'; // Default status is "Menunggu"
        let statusColor = tagColor; // Default status color is blue

        if (timeDiff > 10) {
          status = 'Selesai'; // Change status if more than 10 minutes
          statusColor = tagColorGreen; // Change color to green
        }

        return (
          <Tag
            size="sm"
            variant="subtle"
            colorScheme={status === 'Menunggu' ? 'blue' : 'green'}
            borderRadius="full"
          >
            <TagLabel>{status}</TagLabel>
          </Tag>
        );
      },
    }),
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

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
      <Box
        maxH="400px"
        overflowY="auto"
        borderRadius="12px"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead
            position="sticky"
            top="0"
            zIndex="docked"
            backdropFilter="blur(7px)"
            bg="rgba(255, 255, 255, 0.9)" // Menambahkan transparansi lebih tinggi supaya blur lebih jelas terlihat
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    borderColor={borderColor}
                    onClick={header.column.getToggleSortingHandler()}
                    cursor="pointer"
                    color="gray.600"
                    fontWeight="bold"
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
                bg={index % 2 === 0 ? 'gray.50' : 'white'}
                _hover={{ bg: 'blue.100' }} // Hover effect for a single row
              >
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} borderColor={borderColor} p="12px">
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
