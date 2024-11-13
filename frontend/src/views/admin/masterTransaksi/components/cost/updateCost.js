import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
  Text,
  Button,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons';

const UpdateCost = ({ cost: costToEdit, onUpdateComplete }) => {
  console.log('cost update file :', costToEdit);
  const [cost, setCost] = useState(costToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [iconFile, setIconFile] = useState(costToEdit.icon);
  const [previewIconFile, setPreviewIconFile] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

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
      setIconFile(costToEdit.icon);
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
    const { name, value } = e.target;
    const isNumericInput =
      name === 'cost_price' || name === 'price' || name === 'stock';
    const formattedValue = isNumericInput
      ? value.replace(/[^0-9]/g, '')
      : value;

    setCost((prevCost) => ({
      ...prevCost,
      [name]: formattedValue,
    }));
  };

  const handleIconUpload = (e) => {
    setIconFile(null);
    setPreviewIconFile(e.target.files[0]);
  };

  const handleIconRemove = () => {
    setIconFile(null);
    setPreviewIconFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'cost_price',
      parseFloat(cost.cost_price.replace(/[^\d.-]/g, '')),
    );
    formData.append('price', parseFloat(cost.price.replace(/[^\d.-]/g, '')));
    formData.append('stock', parseInt(cost.stock?.replace(/\D/g, '') || 0, 10));
    formData.append('cost_name', cost.cost_name);
    formData.append('description', cost.description);

    if (iconFile === null) {
      formData.append('icon', 'delete');
      if (previewIconFile) {
        formData.append('icon', previewIconFile);
      }
    }

    try {
      await axios.put(
        `http://localhost:5000/api/costs/${cost.cost_id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
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
    setIconFile(costToEdit.icon);
    setPreviewIconFile(null);
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
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deskripsi</FormLabel>
          <Input
            type="text"
            name="description"
            value={cost?.description || ''}
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
            value={formatCurrency(cost?.cost_price) || ''}
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
            value={formatCurrency(cost?.price) || ''}
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
            value={formatCurrency(cost?.stock) || 0}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Unggah Icon
          </FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleIconUpload}
            isDisabled={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            p={2}
          />
          <Text color="gray.500" fontSize="sm">
            Format yang diterima: JPG, JPEG, PNG
          </Text>
          <br />
          <Box mt={2} position="relative" w={140}>
            <Image
              src={
                previewIconFile instanceof File
                  ? URL.createObjectURL(previewIconFile)
                  : iconFile
                  ? `/assets/img/costs/${iconFile}`
                  : '/assets/img/costs/no-image.png'
              }
              alt={iconFile ? 'Gambar biaya' : 'Gambar kosong'}
              boxSize="100px"
              objectFit="cover"
            />
            {(iconFile || previewIconFile) && (
              <IconButton
                aria-label="Hapus Ikon"
                icon={<CloseIcon />}
                position="absolute"
                top={1}
                right={1}
                onClick={handleIconRemove}
                size="sm"
                colorScheme="red"
              />
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
