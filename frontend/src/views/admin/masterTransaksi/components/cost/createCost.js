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
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format, parse } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar } from 'react-icons/fa';

export default function CreateCost() {
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const createTableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');
  const date = format(new Date(), 'dd MMM yyyy');
  const [cost, setCost] = React.useState({
    cost_name: '',
    cost_description: '',
    amount: '',
    cost_date: date, // Format as "10 Oktober 2024"
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
      setCost({
        cost_name: '',
        cost_description: '',
        amount: '',
        cost_date: date,
      });
    }
    return () => clearInterval(timer);
  }, [countdown, isReadOnly]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCost((prevData) => ({
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
          setCost((prevData) => ({
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

        setCost((prevData) => ({
          ...prevData,
          [name]: formattedValue,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cost.cost_name || !cost.cost_description || !cost.amount) {
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
      formData.append('cost_name', cost.cost_name);
      formData.append('cost_description', cost.cost_description);
      formData.append('amount', parseFloat(cost.amount.replace(/[^0-9]/g, '')));
      formData.append('cost_date', format(cost.cost_date, 'yyyy-M-dd'));
      console.log('formData : ', formData);
      // return;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/costs`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

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
            value={cost.cost_name}
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
            name="cost_description"
            value={cost.cost_description}
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
            value={cost.amount}
            onChange={handleChange}
            placeholder="Jumlah biaya"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4} w="100%">
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Tanggal
          </FormLabel>
          <InputGroup w="100%" display="flex">
            <InputLeftElement pointerEvents="none">
              <FaCalendar color={useColorModeValue('gray.500', 'gray.300')} />
            </InputLeftElement>
            <DatePicker
              selected={
                cost?.cost_date
                  ? parse(cost.cost_date, 'dd MMM yyyy', new Date())
                  : new Date() // Default to today's date if cost_date is not set
              }
              onChange={(date) =>
                handleChange({
                  target: {
                    name: 'cost_date',
                    value: format(date, 'dd MMM yyyy'), // Display as "10 Oktober 2024"
                  },
                })
              }
              dateFormat="dd MMM yyyy"
              customInput={
                <Input
                  pl="2rem" // Padding-left to avoid overlap with the icon
                  name="cost_date"
                  value={cost.cost_date}
                  isReadOnly={isReadOnly}
                  sx={{ width: '100%' }} // Ensures full width
                  bg={isReadOnly ? readOnlyBg : createTableBg}
                  color={isReadOnly ? readOnlyColor : textColor}
                  placeholder="DD MMM YYYY"
                />
              }
            />
          </InputGroup>
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
