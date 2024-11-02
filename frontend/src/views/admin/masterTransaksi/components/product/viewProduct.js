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
import { useNavigate } from 'react-router-dom';

export default function ViewProduct() {
  const [products, setProducts] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate();

  // Fungsi untuk membuka dialog konfirmasi
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsOpen(true);
  };

  // Fungsi untuk menghapus produk
  const deleteProduct = async () => {
    console.log(productToDelete.product_id);
    try {
      // Mengupdate produk untuk mengatur stock ke 0 dan available ke false
      await axios.put(
        `http://localhost:5000/api/products/delete/${productToDelete.product_id}`, // Ubah sesuai dengan endpoint baru
        {
          stock: 0,
          available: false,
        },
      );

      // Mengupdate state produk di frontend
      setProducts(
        products.map((p) =>
          p.product_id === productToDelete.product_id
            ? { ...p, stock: 0, available: false }
            : p,
        ),
      );

      toast({
        title: 'Deleted.',
        description: `Product ${productToDelete.product_name} has been deleted.`,
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
        description: 'Failed to delete product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch product data from API
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

  const handleEdit = (id) => {
    navigate(`/products/update/${id}`); // Pastikan ID yang benar digunakan
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} p={4}>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Nama Produk</Th>
            <Th>Deskripsi</Th>
            <Th isNumeric>Harga Biaya</Th>
            <Th isNumeric>Harga Jual</Th>
            <Th isNumeric>Stok</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr
              key={product.product_id}
              bg={
                product.stock === 0 && product.available === false
                  ? 'red.100'
                  : undefined
              } // Ubah warna latar belakang jika kondisi terpenuhi
            >
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
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
              >
                {product.cost_price}
              </Td>
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
              >
                {product.price}
              </Td>
              <Td
                textDecoration={
                  product.stock === 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
              >
                {product.stock}
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  mr="2"
                  onClick={() => handleEdit(product.product_id)} // Pastikan ID yang benar digunakan
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    console.log(
                      'tes : ',
                      product.stock === 0 && product.available === false,
                    );
                    handleDeleteClick(product);
                  }}
                  isDisabled={
                    product.stock === 0 && product.available === false
                  } // Gunakan isDisabled untuk Chakra UI
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
          sx={{
            backdropFilter: 'blur(1px)',
          }}
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
