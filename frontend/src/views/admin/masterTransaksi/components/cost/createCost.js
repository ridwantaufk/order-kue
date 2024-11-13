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

export default function CreateCost() {
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const createTableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');
  const [costData, setCostData] = React.useState({
    cost_name: '',
    description: '',
    amount: '',
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
      setCostData({
        cost_name: '',
        description: '',
        amount: '',
      });
    }
    return () => clearInterval(timer);
  }, [countdown, isReadOnly]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'amount') {
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
          setCostData((prevData) => ({
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

        setCostData((prevData) => ({
          ...prevData,
          [name]: formattedValue,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!costData.cost_name || !costData.description || !costData.amount) {
      toast({
        title: 'Error.',
        description: 'Silahkan isi semua inputan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cost_name', costData.cost_name);
      formData.append('description', costData.description);
      formData.append(
        'amount',
        parseFloat(costData.amount.replace(/[^0-9]/g, '')),
      );

      const response = await axios.post(
        'http://localhost:5000/api/costs',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Cost added:', response.data);

      toast({
        title: 'Berhasil!',
        description: 'Berhasil menambahkan biaya',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsReadOnly(true);
      setCountdown(5);
    } catch (error) {
      console.error(
        'Error adding cost:',
        error.response?.data?.message || error.message,
      );
      toast({
        title: 'Error!',
        description: error.response?.data?.message || 'Gagal menambah biaya.',
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
          {`Pritinjau dalam waktu ${countdown} detik...`}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Nama Biaya
          </FormLabel>
          <Input
            type="text"
            name="cost_name"
            value={costData.cost_name}
            onChange={handleChange}
            placeholder="Nama biaya"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Deskripsi
          </FormLabel>
          <Textarea
            name="description"
            value={costData.description}
            onChange={handleChange}
            placeholder="Deskripsi biaya"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Jumlah Biaya
          </FormLabel>
          <Input
            type="text"
            name="amount"
            value={costData.amount}
            onChange={handleChange}
            placeholder="Jumlah biaya"
            required
            isReadOnly={isReadOnly}
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
            color={useColorModeValue('white', 'gray.800')}
            _hover={{
              bg: useColorModeValue('teal.600', 'teal.400'),
            }}
          >
            Buat Biaya
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
