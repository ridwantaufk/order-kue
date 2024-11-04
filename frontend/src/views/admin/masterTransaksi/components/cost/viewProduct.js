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

export default function ViewProduct({ onEdit }) {
  const [products, setProducts] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const cancelRef = React.useRef();
  const toast = useToast();

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsOpen(true);
  };

  const deleteProduct = async () => {
    console.log(productToDelete.product_id);
    try {
      await axios.put(
        `http://localhost:5000/api/products/delete/${productToDelete.product_id}`,
        {
          stock: 0,
          available: false,
        },
      );
      setProducts(
        products.map((p) =>
          p.product_id === productToDelete.product_id
            ? { ...p, stock: 0, available: false }
            : p,
        ),
      );

      toast({
        title: 'Dihapus!',
        description: `Produk "${productToDelete.product_name}" telah dihapus.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error.',
        description: 'Gagal menghapus produk',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error.',
          description: 'Failed to load products.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchProducts();
  }, []);

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);

    const sortedProducts = [...products].sort((a, b) => {
      const isNumericColumn = ['cost_price', 'price', 'stock'].includes(column);
      const valA = isNumericColumn ? parseFloat(a[column]) : a[column];
      const valB = isNumericColumn ? parseFloat(b[column]) : b[column];

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
  };

  // Fungsi untuk format IDR
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2, // Selalu tampilkan 2 desimal
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  // Fungsi untuk format stok
  const formatStock = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Box p={4}>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSort('product_name')}>
              Nama Produk
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('description')}>
              Deskripsi
            </Th>
            <Th
              cursor="pointer"
              isNumeric
              onClick={() => handleSort('cost_price')}
            >
              Harga Biaya
            </Th>
            <Th cursor="pointer" isNumeric onClick={() => handleSort('price')}>
              Harga Jual
            </Th>
            <Th cursor="pointer" isNumeric onClick={() => handleSort('stock')}>
              Stok
            </Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr
              key={product.product_id}
              bg={
                product.stock === 0 && product.available === false
                  ? useColorModeValue('red.100', 'red.300') // Warna latar belakang
                  : undefined
              }
            >
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                color={
                  product.stock === 0 && product.available === false
                    ? useColorModeValue('gray.500', 'gray.300') // Warna teks
                    : undefined
                }
              >
                {product.product_name}
              </Td>
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                color={
                  product.stock === 0 && product.available === false
                    ? useColorModeValue('gray.500', 'gray.300')
                    : undefined
                }
              >
                {product.description}
              </Td>
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
                color={
                  product.stock === 0 && product.available === false
                    ? useColorModeValue('gray.500', 'gray.300')
                    : undefined
                }
              >
                {formatCurrency(product.cost_price)}{' '}
              </Td>
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
                color={
                  product.stock === 0 && product.available === false
                    ? useColorModeValue('gray.500', 'gray.300')
                    : undefined
                }
              >
                {formatCurrency(product.price)}{' '}
              </Td>
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
                color={
                  product.stock === 0 && product.available === false
                    ? useColorModeValue('gray.500', 'gray.300')
                    : undefined
                }
              >
                {formatStock(product.stock)}{' '}
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  mr="2"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteClick(product)}
                  isDisabled={
                    product.stock === 0 && product.available === false
                  }
                >
                  Hapus
                </Button>
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
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Produk
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus produk "
              {productToDelete?.product_name}"? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={deleteProduct} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
