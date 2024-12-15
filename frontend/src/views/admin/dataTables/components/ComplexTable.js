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
  MdOutlineError,
  MdAccessTime,
} from 'react-icons/md';
import { io } from 'socket.io-client';

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const [sorting, setSorting] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date

  const socket = io(process.env.REACT_APP_BACKEND_URL);

  React.useEffect(() => {
    // Listen for initial data when the component mounts
    socket.on('orders-data', (orders) => {
      // Filter orders created today
      const filteredData = orders.filter((order) => {
        const createdAt = new Date(order.created_at);
        createdAt.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        return createdAt.getTime() === today.getTime(); // Compare only the date part
      });

      // Sort the filtered data first by 'status' (desc), then by 'created_at' (desc)
      const sortedData = filteredData.sort((a, b) => {
        // Compare by 'status' first
        if (a.status !== b.status) {
          return b.status.localeCompare(a.status); // Sort 'Selesai' (or other statuses) last
        }
        // If 'status' is the same, then compare by 'created_at' (desc)
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setTableData(sortedData); // Set the sorted data
    });

    // Listen for order updates
    socket.on('order-update', (updatedOrder) => {
      setTableData((prevData) => {
        const updatedData = prevData.map((order) =>
          order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order,
        );

        // Re-sort the data after the update
        return updatedData.sort((a, b) => {
          if (a.status !== b.status) {
            return b.status.localeCompare(a.status);
          }
          return new Date(b.created_at) - new Date(a.created_at);
        });
      });
    });

    // Cleanup socket connection when component unmounts
    return () => {
      socket.off('orders-data');
      socket.off('order-update');
    };
  }, []);

  const columns = [
    columnHelper.accessor('order_code', {
      id: 'order_code',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
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
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
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
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          STATUS
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original; // Mengambil data asli dari baris
        const [isCompleted, setIsCompleted] = React.useState(
          row.status === 'Selesai',
        );

        const handleStatusClick = () => {
          console.log('status : ', row.status);
          if (row.status === 'Menunggu') {
            // Update status and progress when clicked
            axios
              .put(
                `${process.env.REACT_APP_BACKEND_URL}/api/orders/${row.order_id}`,
                {
                  status: 'Selesai',
                },
              )
              .then((response) => {
                setIsCompleted(true); // Update the state to reflect the new status
              })
              .catch((error) => {
                console.error('Error updating status:', error);
              });
          }
        };

        return (
          <Flex align="center" onClick={handleStatusClick} cursor="pointer">
            <Icon
              w="24px"
              h="24px"
              me="5px"
              color={
                isCompleted
                  ? 'green.500'
                  : row.status === 'Menunggu'
                  ? 'blue.500'
                  : row.status === 'Batal'
                  ? 'red.500'
                  : null
              }
              as={isCompleted ? MdCheckCircle : MdAccessTime}
            />
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {isCompleted ? 'Selesai' : row.status}
            </Text>
          </Flex>
        );
      },
    }),

    columnHelper.accessor('created_at', {
      id: 'created_at',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
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
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          PROGRESS
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original; // Mengambil data asli dari baris
        const [elapsedTime, setElapsedTime] = React.useState(0);
        const totalTime = 30 * 60 * 1000; // Total waktu dalam milidetik (30 menit)

        // Update progress for 'Menunggu' status only
        React.useEffect(() => {
          if (row.status === 'Menunggu') {
            const interval = setInterval(() => {
              setElapsedTime((prevTime) =>
                Math.min(prevTime + 1000, totalTime),
              );
            }, 1000);
            return () => clearInterval(interval);
          } else if (row.status === 'Selesai') {
            setElapsedTime(totalTime); // Set progress to 100% when status is 'Selesai'
          }
        }, [row.status]);

        const remainingTime = totalTime - elapsedTime;
        const progressPercent =
          row.status === 'Selesai'
            ? 100
            : Math.round((elapsedTime / totalTime) * 100);

        const minutesLeft =
          row.status === 'Menunggu'
            ? String(Math.floor(remainingTime / (60 * 1000))).padStart(2, '0')
            : '00';
        const secondsLeft =
          row.status === 'Menunggu'
            ? String(Math.floor((remainingTime % (60 * 1000)) / 1000)).padStart(
                2,
                '0',
              )
            : '00';

        return (
          <Flex direction="column" align="center" w="120px">
            <Progress
              variant="table"
              colorScheme="brandScheme"
              h="8px"
              w="100%"
              value={progressPercent}
            />
            {row.status === 'Menunggu' && (
              <Text
                color={textColor}
                fontSize="sm"
                fontWeight="700"
                mt="5px"
                minW="100px" // Menjaga panjang tetap
                textAlign="center"
              >
                {progressPercent}% - {minutesLeft}m {secondsLeft}s
              </Text>
            )}
          </Flex>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Orders Table
        </Text>
        <Menu />
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
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
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(0, 11)
              .map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
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
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
