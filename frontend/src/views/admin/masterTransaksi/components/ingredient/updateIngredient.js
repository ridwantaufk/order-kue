import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
  Spinner,
  Checkbox,
  Select,
} from '@chakra-ui/react'; // Import Checkbox here
import { RepeatIcon } from '@chakra-ui/icons';
import axios from 'axios';

const UpdateIngredient = ({
  ingredient: ingredientToEdit,
  onUpdateComplete,
}) => {
  const [ingredient, setIngredient] = useState(ingredientToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const [isAvailable, setIsAvailable] = useState(
    ingredientToEdit?.available || false,
  );
  const [countdown, setCountdown] = useState(5); // Add countdown state
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const editableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');

  useEffect(() => {
    setIngredient(ingredientToEdit);
    setIsAvailable(ingredientToEdit?.available || false);
  }, [ingredientToEdit]);

  useEffect(() => {
    if (isRefreshing) {
      setIngredient(ingredientToEdit);
      setIsRefreshing(false);
      toast({
        title: 'Data berhasil direfresh.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [ingredientToEdit, isRefreshing, toast]);

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(parseFloat(value));
  };

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      const isNumericInput = name === 'quantity' || name === 'price_per_unit';
      const formattedValue = isNumericInput
        ? value.replace(/[^0-9]/g, '')
        : value;
      console.log('formattedValue : ', formattedValue);
      setIngredient((prevIngredient) => ({
        ...prevIngredient,
        [name]: formattedValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('ingredient_name', ingredient.ingredient_name);
    formData.append(
      'quantity',
      parseFloat(ingredient.quantity.replace(/[^\d.-]/g, '')),
    );
    formData.append('unit', ingredient.unit);
    formData.append(
      'price_per_unit',
      parseFloat(ingredient.price_per_unit.replace(/[^\d.-]/g, '')),
    );
    if (ingredient.available === false) {
      formData.append('available', isAvailable);
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/ingredients/${ingredient.ingredient_id}`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      toast({
        title: 'Berhasil.',
        description: 'Data bahan berhasil diperbarui.',
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
        'Error updating ingredient:',
        error.response?.data || error.message,
      );
      toast({
        title: 'Gagal.',
        description: 'Gagal memperbarui bahan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    setIngredient(ingredientToEdit);
    setIsAvailable(ingredientToEdit?.available || false);
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
          <FormLabel>Nama Bahan</FormLabel>
          <Input
            type="text"
            name="ingredient_name"
            value={ingredient?.ingredient_name || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Nama bahan harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Jumlah</FormLabel>
          <Input
            type="text"
            name="quantity"
            value={formatCurrency(ingredient?.quantity) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Jumlah bahan harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga per Satuan</FormLabel>
          <Input
            type="text"
            name="price_per_unit"
            value={formatCurrency(ingredient?.price_per_unit) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga per satuan bahan harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Satuan</FormLabel>
          <Select
            name="unit"
            value={ingredient?.unit || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          >
            <option value="">Pilih Satuan</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="g">Gram (g)</option>
            <option value="mg">Miligram (mg)</option>
            <option value="L">Liter (L)</option>
            <option value="mL">Mililiter (mL)</option>
            <option value="ons">Ons</option>
            <option value="butir">Butir</option>
            <option value="cangkir">Cup (Cangkir)</option>
            <option value="lembar">Lembar</option>
            <option value="sachet">Sachet</option>
            <option value="bungkus">Bungkus</option>
            <option value="potong">Potong</option>
            <option value="iris">Iris</option>
            <option value="sdt">Sendok Teh (sdt)</option>
            <option value="sdm">Sendok Makan (sdm)</option>
            <option value="tetes">Tetes</option>
            <option value="batang">Batang</option>
            <option value="kaleng">Kaleng</option>
            <option value="tangkai">Tangkai</option>
            <option value="buah">Buah</option>
            <option value="paket">Paket</option>
          </Select>
        </FormControl>
        {ingredient?.available === false && (
          <FormControl display="flex" alignItems="center">
            {!isReadOnly && (
              <Checkbox
                name="available"
                isChecked={isAvailable}
                onChange={() => setIsAvailable(!isAvailable)}
                isDisabled={isReadOnly}
                ml={3}
              >
                Aktif
              </Checkbox>
            )}
          </FormControl>
        )}

        <Box mt={4}>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={false}
            isFullWidth
            isDisabled={isReadOnly}
          >
            Perbarui
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateIngredient;
