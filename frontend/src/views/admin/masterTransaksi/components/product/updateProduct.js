import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

const UpdateProduct = ({ product: productToEdit, onUpdateComplete }) => {
  const [product, setProduct] = useState(productToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false); // State untuk mengatur readonly
  const [countdown, setCountdown] = useState(3); // State untuk hitung mundur
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(productToEdit);
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/${product.product_id}`,
        product,
      );
      toast({
        title: 'Success.',
        description: 'Perbarui produk berhasil',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsReadOnly(true); // Set field menjadi read-only
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            onUpdateComplete();
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error.',
        description: 'Gagal perbarui produk.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Nama Produk</FormLabel>
          <Input
            type="text"
            name="product_name"
            value={product?.product_name || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : 'white'} // Background gelap saat read-only
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deskripsi</FormLabel>
          <Input
            type="text"
            name="description"
            value={product?.description || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : 'white'}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Biaya</FormLabel>
          <Input
            type="number"
            name="cost_price"
            value={product?.cost_price || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : 'white'}
            step="0.01"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Jual</FormLabel>
          <Input
            type="number"
            name="price"
            value={product?.price || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : 'white'}
            step="0.01"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Stok</FormLabel>
          <Input
            type="number"
            name="stock"
            value={product?.stock || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : 'white'}
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit" isDisabled={isReadOnly}>
          {isReadOnly
            ? `Kembali ke informasi dalam ${countdown} detik...`
            : 'Perbarui Produk'}
        </Button>
      </form>
    </Box>
  );
};

export default UpdateProduct;
