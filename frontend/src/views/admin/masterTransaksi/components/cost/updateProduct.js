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
  useColorModeValue,
} from '@chakra-ui/react';

const UpdateProduct = ({ product: productToEdit, onUpdateComplete }) => {
  const [product, setProduct] = useState(productToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const toast = useToast();
  const navigate = useNavigate();

  // Use color mode values unconditionally
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const editableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');

  useEffect(() => {
    setProduct(productToEdit);
  }, [productToEdit]);

  const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('id-ID').format(numberValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumericInput =
      name === 'cost_price' || name === 'price' || name === 'stock';
    const formattedValue = isNumericInput
      ? value.replace(/[^0-9]/g, '')
      : value;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/${product.product_id}`,
        {
          ...product,
          cost_price:
            parseFloat(
              product.cost_price.replace(/\./g, '').replace(',', '.'),
            ) || 0,
          price:
            parseFloat(product.price.replace(/\./g, '').replace(',', '.')) || 0,
          stock: parseInt(product.stock.replace(/\./g, ''), 10) || 0,
        },
      );
      toast({
        title: 'Berhasil.',
        description: 'Perbarui produk berhasil',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsReadOnly(true);
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
        title: 'Gagal.',
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
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
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
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Biaya</FormLabel>
          <Input
            type="text"
            name="cost_price"
            value={formatCurrency(product?.cost_price) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Jual</FormLabel>
          <Input
            type="text"
            name="price"
            value={formatCurrency(product?.price) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Stok</FormLabel>
          <Input
            type="text"
            name="stock"
            value={formatCurrency(product?.stock) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
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
