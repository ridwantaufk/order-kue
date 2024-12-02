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
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function CreateTool() {
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const formBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');

  const [tool, setTool] = React.useState({
    tool_name: '',
    quantity: '',
    unit_price: '',
  });
  const [isReadOnly, setIsReadOnly] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const toast = useToast();

  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && isReadOnly) {
      resetForm();
    }
    return () => clearInterval(timer);
  }, [countdown, isReadOnly]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTool((prevTool) => ({
      ...prevTool,
      [name]:
        name === 'quantity' || name === 'unit_price'
          ? value.replace(/[^0-9.]/g, '')
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tool_name, quantity, unit_price } = tool;

    if (!tool_name || !quantity || !unit_price) {
      return toast({
        title: 'Error',
        description: 'Semua field wajib diisi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tools`, {
        tool_name,
        quantity: parseFloat(quantity),
        unit_price: parseFloat(unit_price),
      });

      toast({
        title: 'Berhasil',
        description: 'Data alat berhasil ditambahkan.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsReadOnly(true);
      setCountdown(5);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Gagal menyimpan data alat.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setIsReadOnly(false);
    setTool({
      tool_name: '',
      quantity: '',
      unit_price: '',
    });
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
          <FormLabel>Nama Alat</FormLabel>
          <Input
            type="text"
            name="tool_name"
            value={tool.tool_name}
            onChange={handleChange}
            placeholder="Nama alat"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : formBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Jumlah</FormLabel>
          <Input
            type="text"
            name="quantity"
            value={tool.quantity}
            onChange={handleChange}
            placeholder="Jumlah"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : formBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Harga per Unit</FormLabel>
          <Input
            type="text"
            name="unit_price"
            value={tool.unit_price}
            onChange={handleChange}
            placeholder="Harga per unit"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : formBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <Flex justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="teal"
            isDisabled={isReadOnly}
            _hover={{ bg: useColorModeValue('teal.600', 'teal.400') }}
          >
            Tambah Alat
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
