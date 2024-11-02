'use client';
/* eslint-disable */

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function CreateProduct() {
  const [productData, setProductData] = React.useState({
    product_name: '',
    description: '',
    cost_price: '',
    price: '',
    stock: '',
  });
  const [isReadOnly, setIsReadOnly] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const toast = useToast();

  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isReadOnly) {
      setIsReadOnly(false);
      setProductData({
        product_name: '',
        description: '',
        cost_price: '',
        price: '',
        stock: '',
      });
    }
    return () => clearInterval(timer);
  }, [countdown, isReadOnly]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'cost_price' || name === 'price' || name === 'stock') {
      const nonNumericCharacters = value.replace(/[0-9.]/g, '');

      if (nonNumericCharacters.length > 0) {
        const displayedChar = nonNumericCharacters[0];

        toast({
          title: 'Warning.',
          description: `Character "${displayedChar}" will be removed.`,
          status: 'warning',
          duration: 1000,
          isClosable: true,
        });

        setTimeout(() => {
          const numericValue = value.replace(/[^0-9]/g, '');
          setProductData((prevData) => ({
            ...prevData,
            [name]: numericValue,
          }));
        }, 1000);
      } else {
        const numericValue = value.replace(/[^0-9]/g, '');
        const formattedValue = new Intl.NumberFormat('id-ID', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(numericValue);

        setProductData((prevData) => ({
          ...prevData,
          [name]: formattedValue,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productData.product_name ||
      !productData.description ||
      !productData.cost_price ||
      !productData.price ||
      !productData.stock
    ) {
      toast({
        title: 'Error.',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/products', {
        product_name: productData.product_name,
        description: productData.description,
        cost_price: parseFloat(productData.cost_price.replace(/[^0-9]/g, '')),
        price: parseFloat(productData.price.replace(/[^0-9]/g, '')),
        stock: parseInt(productData.stock.replace(/[^0-9]/g, '')),
        icon: null,
      });

      console.log('Product added:', response.data);
      toast({
        title: 'Success!',
        description: 'Product added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Set read-only mode and start countdown
      setIsReadOnly(true);
      setCountdown(5); // Start countdown from 5 seconds
    } catch (error) {
      console.error(
        'Error adding product:',
        error.response?.data?.message || error.message,
      );
      toast({
        title: 'Error.',
        description: error.response?.data?.message || 'Failed to add product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} p={4}>
      {countdown > 0 && (
        <Text mb={4} color="green.500">
          {`Pritinjau dalam waktu ${countdown} detik...`}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Nama Produk</FormLabel>
          <Input
            type="text"
            name="product_name"
            value={productData.product_name}
            onChange={handleChange}
            placeholder="Nama produk"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : undefined}
            onInvalid={(e) =>
              e.target.setCustomValidity('Nama produk harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Deskripsi</FormLabel>
          <Textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Deskripsi produk"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : undefined}
            onInvalid={(e) =>
              e.target.setCustomValidity('Deskripsi harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Harga Biaya</FormLabel>
          <Input
            type="text"
            name="cost_price"
            value={productData.cost_price}
            onChange={handleChange}
            placeholder="Harga biaya"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : undefined}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga biaya harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Harga Jual</FormLabel>
          <Input
            type="text"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Harga jual"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : undefined}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga jual harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Stok</FormLabel>
          <Input
            type="text"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            placeholder="Stok"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? 'gray.200' : undefined}
            onInvalid={(e) => e.target.setCustomValidity('Stok harus diisi.')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <Flex justifyContent="flex-end">
          <Button type="submit" colorScheme="teal" isDisabled={isReadOnly}>
            Buat Produk
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
