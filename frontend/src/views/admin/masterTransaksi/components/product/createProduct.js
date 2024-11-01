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
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Set the product data immediately to reflect the user's input
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Allow only numeric input for cost_price, price, and stock
    if (name === 'cost_price' || name === 'price' || name === 'stock') {
      // Check for non-numeric characters
      const nonNumericCharacters = value.replace(/[0-9.]/g, '');

      if (nonNumericCharacters.length > 0) {
        // Display the non-numeric character temporarily
        const displayedChar = nonNumericCharacters[0];

        // Show the character alert
        toast({
          title: 'Warning.',
          description: `Character "${displayedChar}" will be removed.`,
          status: 'warning',
          duration: 1000,
          isClosable: true,
        });

        // Use setTimeout to remove non-numeric characters after 1 second
        setTimeout(() => {
          const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
          setProductData((prevData) => ({
            ...prevData,
            [name]: numericValue,
          }));
        }, 1000); // Show for 1 second
      } else {
        // If the input is numeric, format as currency (Rupiah)
        const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        const formattedValue = new Intl.NumberFormat('id-ID', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(numericValue); // Format to IDR style without 'Rp'

        // Update state with the formatted value
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
        cost_price: parseFloat(productData.cost_price),
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
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

      setProductData({
        product_name: '',
        description: '',
        cost_price: '',
        price: '',
        stock: '',
      });
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
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Nama Produk</FormLabel>
          <Input
            type="text"
            name="product_name"
            value={productData.product_name}
            onChange={handleChange}
            required
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
            required
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
            required
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
            required
            onInvalid={(e) => e.target.setCustomValidity('Stok harus diisi.')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <Flex justifyContent="flex-end">
          <Button type="submit" colorScheme="teal">
            Buat Produk
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
