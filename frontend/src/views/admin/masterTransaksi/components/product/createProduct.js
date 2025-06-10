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
  Select,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function CreateProduct() {
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const createTableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');
  const [productData, setProductData] = React.useState({
    product_name: '',
    description: '',
    cost_price: '',
    price: '',
    stock: '',
    category: '',
  });
  const [isReadOnly, setIsReadOnly] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const [iconFile, setIconFile] = React.useState(null);
  const toast = useToast();
  const iconInputRef = React.useRef(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
        category: '',
      });
      setIconFile(null);
      if (iconInputRef.current) {
        iconInputRef.current.value = ''; // Mengosongkan nilai input file
      }
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

  const handleIconUpload = (e) => {
    setIconFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (
      !productData.product_name ||
      !productData.description ||
      !productData.cost_price ||
      !productData.price ||
      !productData.stock ||
      !productData.category
    ) {
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
      formData.append('product_name', productData.product_name);
      formData.append('description', productData.description);
      formData.append(
        'cost_price',
        parseFloat(productData.cost_price.replace(/[^0-9]/g, '')),
      );
      formData.append(
        'price',
        parseFloat(productData.price.replace(/[^0-9]/g, '')),
      );
      formData.append(
        'stock',
        parseInt(productData.stock.replace(/[^0-9]/g, '')),
      );
      formData.append('category', productData.category);
      if (iconFile) {
        formData.append('icon', iconFile);
      }

      console.log('ISI : ', formData);

      // return;

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      toast({
        title: 'Berhasil!',
        description: 'Berhasil menambahkan produk',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsReadOnly(true);
      setCountdown(5);
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        'Error adding product:',
        error.response?.data?.message || error.message,
      );
      toast({
        title: 'Error!',
        description: error.response?.data?.message || 'Gagal menambah produk.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
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
            Nama Produk
          </FormLabel>
          <Input
            type="text"
            name="product_name"
            value={productData.product_name}
            onChange={handleChange}
            placeholder="Nama produk"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Nama produk harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Deskripsi
          </FormLabel>
          <Textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Deskripsi produk"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Deskripsi harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Harga Biaya
          </FormLabel>
          <Input
            type="text"
            name="cost_price"
            value={productData.cost_price}
            onChange={handleChange}
            placeholder="Harga biaya"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga biaya harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Harga Jual
          </FormLabel>
          <Input
            type="text"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Harga jual"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga jual harus diisi.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Stok
          </FormLabel>
          <Input
            type="text"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            placeholder="Stok"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) => e.target.setCustomValidity('Stok harus diisi.')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Kategori Produk
          </FormLabel>
          <Select
            name="category"
            value={productData.category}
            onChange={handleChange}
            placeholder="Pilih kategori"
            required
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Kategori harus dipilih.')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          >
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={useColorModeValue('gray.800', 'white')}>
            Unggah Icon
          </FormLabel>
          <Input
            ref={iconInputRef}
            type="file"
            accept="image/*"
            onChange={handleIconUpload}
            isDisabled={isReadOnly}
            bg={isReadOnly ? readOnlyBg : createTableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            p={2}
          />
          <Text color="gray.500" fontSize="sm">
            Format yang diterima: JPG, JPEG, PNG
          </Text>
        </FormControl>
        <Flex justifyContent="flex-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="teal"
            isDisabled={isReadOnly}
            bg={useColorModeValue('teal.500', 'teal.300')}
            color={useColorModeValue('white', 'gray.800')}
            _hover={{
              bg: useColorModeValue('teal.600', 'teal.400'),
            }}
          >
            Buat Produk
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
