import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Text,
  Button,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import { format, parse } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const UpdateCost = ({ cost: costToEdit, onUpdateComplete }) => {
  const [cost, setCost] = useState(costToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const [isActive, setIsActive] = useState(false);

  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const editableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');

  useEffect(() => {
    setCost(costToEdit);
  }, [costToEdit]);

  useEffect(() => {
    if (isRefreshing) {
      setCost(costToEdit);
      setIsRefreshing(false);

      toast({
        title: 'Data berhasil direfresh.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [costToEdit, isRefreshing, toast]);

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(parseFloat(value));
  };

  const handleChange = (e) => {
    if (e.target != undefined) {
      const { name, value } = e.target;
      const isNumericInput = name === 'amount';
      const formattedValue = isNumericInput
        ? value.replace(/[^0-9]/g, '')
        : value;
      setCost((prevCost) => ({
        ...prevCost,
        [name]: formattedValue,
      }));
    } else if (e instanceof Date) {
      const formattedDate = format(e, 'yyyy-MM-dd');
      setCost((prevCost) => ({
        ...prevCost,
        cost_date: formattedDate,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('cost_name', cost.cost_name);
    formData.append('cost_description', cost.cost_description);
    formData.append('amount', parseFloat(cost.amount.replace(/[^\d.-]/g, '')));
    formData.append('cost_date', cost.cost_date);
    if (cost.active === false) {
      formData.append('active', isActive);
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/costs/${cost.cost_id}`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      toast({
        title: 'Berhasil.',
        description: 'Perbarui biaya berhasil',
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
      console.error(
        'Error updating cost:',
        error.response?.data || error.message,
      );
      toast({
        title: 'Gagal.',
        description: 'Gagal perbarui biaya.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    setCost(costToEdit);
    toast({
      title: 'Form berhasil direfresh.',
      status: 'info',
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <Box w="100%" p={4}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Tooltip label="Refresh" aria-label="Refresh Tooltip">
          <IconButton
            aria-label="Refresh Form"
            icon={isRefreshing ? <Spinner size="sm" /> : <RepeatIcon />}
            onClick={handleRefresh}
            colorScheme="blue"
            size="sm"
            isDisabled={isRefreshing}
          />
        </Tooltip>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Nama Biaya</FormLabel>
          <Input
            type="text"
            name="cost_name"
            value={cost?.cost_name || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Nama biaya harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deskripsi Biaya</FormLabel>
          <Textarea
            name="cost_description"
            value={cost?.cost_description || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Deskripsi biaya harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Pembiayaan</FormLabel>
          <Input
            type="text"
            name="amount"
            value={formatCurrency(cost?.amount) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga pembiayaan harus diisi.')
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tanggal</FormLabel>
          <Box display="flex" alignItems="center">
            <DatePicker
              selected={
                cost?.cost_date
                  ? parse(cost.cost_date, 'yyyy-MM-dd', new Date())
                  : null
              }
              onChange={(date) =>
                handleChange({
                  target: {
                    name: 'cost_date',
                    value: format(date, 'yyyy-MM-dd'),
                  },
                })
              }
              dateFormat="dd MMM yyyy"
              customInput={
                <Input
                  name="cost_date"
                  value={
                    cost?.cost_date
                      ? format(
                          parse(cost.cost_date, 'yyyy-MM-dd', new Date()),
                          'dd MMM yyyy',
                        )
                      : ''
                  }
                  isReadOnly={isReadOnly}
                  bg={isReadOnly ? readOnlyBg : editableBg}
                  color={isReadOnly ? readOnlyColor : textColor}
                  placeholder="DD MMM YYYY"
                />
              }
            />
            {cost?.active === false && (
              <Checkbox
                ml={4}
                isChecked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked);
                }}
              >
                <Text color={textColor} ml={2}>
                  {isActive ? 'Aktif' : 'Non-Aktif'}
                </Text>
              </Checkbox>
            )}
          </Box>
        </FormControl>

        <Button mt={4} colorScheme="blue" type="submit" isDisabled={isReadOnly}>
          {isReadOnly
            ? `Form tidak dapat diedit dalam ${countdown} detik`
            : 'Perbarui Biaya'}
        </Button>
      </form>
    </Box>
  );
};

export default UpdateCost;
