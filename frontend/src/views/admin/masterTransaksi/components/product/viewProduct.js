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
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function ViewProduct() {
  const [products, setProducts] = React.useState([]);
  const toast = useToast();

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
            <Tr key={product.id}>
              <Td>{product.product_name}</Td>
              <Td>{product.description}</Td>
              <Td isNumeric>{product.cost_price}</Td>
              <Td isNumeric>{product.price}</Td>
              <Td isNumeric>{product.stock}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  mr="2"
                  onClick={() => console.log(`Edit product ${product.id}`)}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => console.log(`Delete product ${product.id}`)}
                >
                  Hapus
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
