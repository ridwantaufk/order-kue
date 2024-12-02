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
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function CreateIngredient() {
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const createTableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');
  const [ingredient, setIngredient] = React.useState({
    ingredient_name: '',
    quantity: '',
    unit: '',
    price_per_unit: '',
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
      setIngredient({
        ingredient_name: '',
        quantity: '',
        unit: '',
        price_per_unit: '',
      });
    }
    return () => clearInterval(timer);
  }, [countdown, isReadOnly]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setIngredient((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'quantity' || name === 'price_per_unit') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      setIngredient((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ingredient_name, quantity, unit, price_per_unit } = ingredient;

    if (!ingredient_name || !quantity || !price_per_unit) {
      toast({
        title: 'Error.',
        description: 'Nama bahan, jumlah, dan harga per unit harus diisi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formattedData = {
        ingredient_name,
        quantity: parseFloat(quantity),
        unit,
        price_per_unit: parseFloat(price_per_unit),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ingredients`,
        formattedData,
      );

      toast({
        title: 'Berhasil!',
        description: 'Data bahan berhasil ditambahkan.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsReadOnly(true);
      setCountdown(5);
    } catch (error) {
      toast({
        title: 'Error!',
        description:
          error.response?.data?.message || 'Gagal menambahkan data bahan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" p={4}>
      {countdown > 0 && (
        <Text mb={4} color="green.500">
          {`Form akan reset dalam ${countdown} detik...`}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Nama Bahan
          </FormLabel>
          <Input
            type="text"
            name="ingredient_name"
            value={ingredient.ingredient_name}
            onChange={handleChange}
            placeholder="Nama bahan"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Jumlah
          </FormLabel>
          <Input
            type="text"
            name="quantity"
            value={ingredient.quantity}
            onChange={handleChange}
            placeholder="Jumlah"
            required
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Satuan
          </FormLabel>
          <Input
            type="text"
            name="unit"
            value={ingredient.unit}
            onChange={handleChange}
            placeholder="Satuan (opsional)"
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Harga per Satuan
          </FormLabel>
          <Input
            type="text"
            name="price_per_unit"
            value={ingredient.price_per_unit}
            onChange={handleChange}
            placeholder="Harga per satuan"
            required
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <Flex justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="teal"
            isDisabled={isReadOnly}
            bg={useColorModeValue('teal.500', 'teal.300')}
            _hover={{ bg: useColorModeValue('teal.600', 'teal.400') }}
          >
            Tambah Bahan
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
