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

export default function ViewIngredient({ onEdit }) {
  const [ingredients, setIngredients] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIngredients, setSelectedIngredients] = React.useState([]);
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [ingredientToDelete, setIngredientToDelete] = React.useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const rowBgColorTr = useColorModeValue('red.100', 'red.300');
  const rowBgColorTd = useColorModeValue('gray.500', 'gray.300');

  const handleDeleteClick = (ingredient = null) => {
    setIngredientToDelete(ingredient);
    setIsOpen(true);
  };

  const deleteSelectedIngredients = async () => {
    try {
      const ingredientsToDelete =
        selectedIngredients.length > 0
          ? selectedIngredients
          : [ingredientToDelete];

      if (!ingredientsToDelete && ingredientsToDelete.length === 0) {
        throw new Error('Tidak ada bahan yang dipilih untuk dihapus.');
      }

      await Promise.all(
        ingredientsToDelete.map(async (ingredient) => {
          if (ingredient.ingredient_id) {
            await axios.put(
              `${process.env.REACT_APP_BACKEND_URL}/api/ingredients/delete/${ingredient.ingredient_id}`,
              {
                available: false,
              },
            );
          } else {
            throw new Error(
              `Ingredient ID tidak valid untuk bahan ${ingredient.ingredient_name}`,
            );
          }
        }),
      );

      setIngredients((prevIngredients) =>
        prevIngredients.map((i) =>
          ingredientsToDelete.some(
            (selected) => selected.ingredient_id === i.ingredient_id,
          )
            ? { ...i, available: false }
            : i,
        ),
      );

      toast({
        title: 'Dihapus!',
        description: `${ingredientsToDelete.length} bahan telah dihapus.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setSelectedIngredients([]);
      setIsAllSelected(false);
      setIngredientToDelete(null);
    } catch (error) {
      console.error(
        'Error deleting ingredients:',
        error.response ? error.response.data : error.message,
      );
      toast({
        title: 'Error.',
        description:
          'Gagal menghapus bahan: ' +
          (error.response ? error.response.data.message : error.message),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/ingredients`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true', // gara-gara baris nu kieu patut beak mikiran
            },
          },
        );
        const sortedIngredients = response.data.sort((a, b) =>
          a.ingredient_name.localeCompare(b.ingredient_name),
        );
        console.log('result :', sortedIngredients);
        setIngredients(sortedIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error.response);
        toast({
          title: 'Error.',
          description: 'Failed to load ingredients.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchIngredients();
  }, []);

  React.useEffect(() => {
    const activeIngredients = ingredients.filter(
      (ingredient) => ingredient.available === true,
    );
    const allSelected =
      activeIngredients.length > 0 &&
      activeIngredients.every((ingredient) =>
        selectedIngredients.some(
          (selected) => selected.ingredient_id === ingredient.ingredient_id,
        ),
      );

    setIsAllSelected(allSelected);
  }, [selectedIngredients, ingredients]);

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    const sortedIngredients = [...ingredients].sort((a, b) => {
      const isNumericColumn = ['quantity', 'price_per_unit'].includes(column);
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

    setIngredients(sortedIngredients);
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
    const allIngredients = ingredients.filter(
      (ingredient) => ingredient.available === true,
    );

    if (isAllSelected) {
      // Jika semua dipilih, maka uncheck semua
      setSelectedIngredients([]);
      setIsAllSelected(false);
    } else {
      // Jika belum semua dipilih, pilih semua
      setSelectedIngredients(allIngredients);
      setIsAllSelected(true);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    if (
      selectedIngredients.some(
        (selected) => selected.ingredient_id === ingredient.ingredient_id,
      )
    ) {
      setSelectedIngredients(
        selectedIngredients.filter(
          (selected) => selected.ingredient_id !== ingredient.ingredient_id,
        ),
      );
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  return (
    <Box w="100%" p={4}>
      <Button
        colorScheme="red"
        onClick={handleDeleteClick}
        isDisabled={selectedIngredients.length === 0}
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
            <Th cursor="pointer" onClick={() => handleSort('ingredient_name')}>
              Nama Bahan
            </Th>
            <Th
              cursor="pointer"
              isNumeric
              onClick={() => handleSort('quantity')}
            >
              Jumlah
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('unit')}>
              Satuan
            </Th>
            <Th
              cursor="pointer"
              isNumeric
              onClick={() => handleSort('price_per_unit')}
            >
              Harga per Satuan
            </Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredients.map((ingredient) => (
            <Tr
              key={ingredient.ingredient_id}
              bg={ingredient.available === false ? rowBgColorTr : undefined}
            >
              <Td>
                <Checkbox
                  isChecked={selectedIngredients.some(
                    (selected) =>
                      selected.ingredient_id === ingredient.ingredient_id,
                  )}
                  onChange={() => handleSelectIngredient(ingredient)}
                  colorScheme="red"
                  isDisabled={ingredient.available === false}
                />
              </Td>
              <Td
                textDecoration={
                  ingredient.available === false ? 'line-through' : 'none'
                }
                color={
                  ingredient.available === false ? rowBgColorTd : undefined
                }
              >
                {ingredient.ingredient_name}
              </Td>
              <Td
                textDecoration={
                  ingredient.available === false ? 'line-through' : 'none'
                }
                isNumeric
                color={
                  ingredient.available === false ? rowBgColorTd : undefined
                }
              >
                {ingredient.quantity}
              </Td>
              <Td
                textDecoration={
                  ingredient.available === false ? 'line-through' : 'none'
                }
                color={
                  ingredient.available === false ? rowBgColorTd : undefined
                }
              >
                {ingredient.unit}
              </Td>
              <Td
                textDecoration={
                  ingredient.available === false ? 'line-through' : 'none'
                }
                isNumeric
                color={
                  ingredient.available === false ? rowBgColorTd : undefined
                }
              >
                {formatCurrency(ingredient.price_per_unit)}
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button colorScheme="blue" onClick={() => onEdit(ingredient)}>
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteClick(ingredient)}
                    isDisabled={ingredient.available === false}
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
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Bahan
            </AlertDialogHeader>

            <AlertDialogBody>
              Anda yakin ingin menghapus bahan{' '}
              {ingredientToDelete?.ingredient_name}? Ini akan menonaktifkan
              bahan tersebut.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteSelectedIngredients}
                ml={3}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
