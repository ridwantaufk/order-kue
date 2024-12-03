'use client';
/* eslint-disable */

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Checkbox,
  HStack,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function ViewCost({ onEdit }) {
  const [costs, setCosts] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCosts, setSelectedCosts] = React.useState([]);
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [costToDelete, setCostToDelete] = React.useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const rowBgColorTr = useColorModeValue('red.100', 'red.300');
  const rowBgColorTd = useColorModeValue('gray.500', 'gray.300');

  const handleDeleteClick = (cost = null) => {
    setCostToDelete(cost);
    setIsOpen(true);
  };

  const deleteSelectedCosts = async () => {
    try {
      const costsToDelete =
        selectedCosts.length > 0 ? selectedCosts : [costToDelete];

      if (!costToDelete && costsToDelete.length === 0) {
        throw new Error('Tidak ada biaya yang dipilih untuk dihapus.');
      }

      await Promise.all(
        costsToDelete.map(async (cost) => {
          if (cost.cost_id) {
            await axios.put(
              `${process.env.REACT_APP_BACKEND_URL}/api/costs/delete/${cost.cost_id}`,
              {
                active: false,
              },
            );
          } else {
            throw new Error(
              `Cost ID tidak valid untuk biaya ${cost.cost_name}`,
            );
          }
        }),
      );

      setCosts((prevCosts) =>
        prevCosts.map((c) =>
          costsToDelete.some((selected) => selected.cost_id === c.cost_id)
            ? { ...c, active: false }
            : c,
        ),
      );

      toast({
        title: 'Dihapus!',
        description: `${costsToDelete.length} biaya telah dihapus.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setSelectedCosts([]);
      setIsAllSelected(false);
      setCostToDelete(null);
    } catch (error) {
      console.error(
        'Error deleting costs:',
        error.response ? error.response.data : error.message,
      );
      toast({
        title: 'Error.',
        description:
          'Gagal menghapus biaya: ' +
          (error.response ? error.response.data.message : error.message),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    const fetchCosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/costs`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true', // gara-gara baris nu kieu patut beak mikiran
            },
          },
        );
        console.log('Status Code:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        console.log('Response Data:', response.data);
        console.log('response : ', response);
        // return;
        const sortedCosts = response.data.sort((a, b) =>
          a.cost_name.localeCompare(b.cost_name),
        );
        console.log('result costs :', sortedCosts);
        setCosts(sortedCosts);
      } catch (error) {
        console.error('Error fetching costs:', error);
        toast({
          title: 'Error.',
          description: 'Failed to load costs.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchCosts();
  }, []);

  React.useEffect(() => {
    const activeCosts = costs.filter((cost) => cost.active === true);
    const allSelected =
      activeCosts.length > 0 &&
      activeCosts.every((cost) =>
        selectedCosts.some((selected) => selected.cost_id === cost.cost_id),
      );

    setIsAllSelected(allSelected);
  }, [selectedCosts, costs]);

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    const sortedCosts = [...costs].sort((a, b) => {
      console.log('a : ', a, 'b : ', b);
      const isNumericColumn = ['amount'].includes(column);
      const valA = isNumericColumn
        ? parseFloat(a[column])
        : a[column].toLowerCase();
      const valB = isNumericColumn
        ? parseFloat(b[column])
        : b[column].toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCosts(sortedCosts);
  };

  const formatCurrency = (value) => {
    if (value == null) return 'Rp 0';
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  const handleSelectAll = () => {
    const allCosts = costs.filter((cost) => cost.active === true);

    if (isAllSelected) {
      // Jika semua dipilih, maka uncheck semua
      setSelectedCosts([]);
      setIsAllSelected(false);
    } else {
      // Jika belum semua dipilih, pilih semua
      setSelectedCosts(allCosts);
      setIsAllSelected(true);
    }
  };

  const handleSelectCost = (cost) => {
    if (selectedCosts.some((selected) => selected.cost_id === cost.cost_id)) {
      setSelectedCosts(
        selectedCosts.filter((selected) => selected.cost_id !== cost.cost_id),
      );
    } else {
      setSelectedCosts([...selectedCosts, cost]);
    }
  };

  return (
    <Box w="100%" p={4}>
      <Button
        colorScheme="red"
        onClick={handleDeleteClick}
        isDisabled={selectedCosts.length === 0}
        mb={4}
      >
        Hapus Terpilih
      </Button>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={isAllSelected}
                onChange={handleSelectAll}
                colorScheme="red"
              />
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('cost_name')}>
              Nama Biaya
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('cost_description')}>
              Deskripsi Biaya
            </Th>
            <Th cursor="pointer" isNumeric onClick={() => handleSort('amount')}>
              Jumlah Biaya
            </Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {costs.map((cost) => (
            <Tr
              key={cost.cost_id}
              bg={cost.active == false ? rowBgColorTr : undefined}
            >
              <Td>
                <Checkbox
                  isChecked={selectedCosts.some(
                    (selected) => selected.cost_id === cost.cost_id,
                  )}
                  onChange={() => handleSelectCost(cost)}
                  colorScheme="red"
                  isDisabled={cost.active === false}
                />
              </Td>
              <Td
                textDecoration={cost.active == false ? 'line-through' : 'none'}
                color={cost.active == false ? rowBgColorTd : undefined}
              >
                {cost.cost_name}
              </Td>
              <Td
                textDecoration={cost.active == false ? 'line-through' : 'none'}
                color={cost.active == false ? rowBgColorTd : undefined}
              >
                {cost.cost_description}
              </Td>
              <Td
                textDecoration={cost.active == false ? 'line-through' : 'none'}
                isNumeric
                color={cost.active == false ? rowBgColorTd : undefined}
              >
                {formatCurrency(cost.amount)}{' '}
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button colorScheme="blue" onClick={() => onEdit(cost)}>
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteClick(cost)}
                    isDisabled={cost.active == false}
                  >
                    Hapus
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay
          bg="rgba(0, 0, 0, 0.8)"
          sx={{ backdropFilter: 'blur(1px)' }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>Konfirmasi Hapus Biaya</AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus biaya yang dipilih? Tindakan ini
              tidak bisa dibatalkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={deleteSelectedCosts} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
