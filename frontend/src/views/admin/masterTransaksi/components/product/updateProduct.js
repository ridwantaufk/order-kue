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
  Textarea,
  Select,
} from '@chakra-ui/react';
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons';

const UpdateProduct = ({ product: productToEdit, onUpdateComplete }) => {
  const [product, setProduct] = useState(productToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [iconFile, setIconFile] = useState(productToEdit.icon);
  const [previewIconFile, setPreviewIconFile] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const fileInputRef = React.useRef(null);

  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const editableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');

  useEffect(() => {
    setProduct(productToEdit);
  }, [productToEdit]);

  useEffect(() => {
    if (isRefreshing) {
      // Mulai waktu refresh ketika `productToEdit` diperbarui
      setProduct(productToEdit);
      setIconFile(productToEdit.icon);

      // Set selesai refresh ketika data sudah di-update ke state
      setIsRefreshing(false);

      toast({
        title: 'Data berhasil direfresh.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [productToEdit, isRefreshing, toast]);

  // Function to display currency without modifying actual value
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

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: formattedValue,
    }));
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIconFile(null);
    setPreviewIconFile(file);
  };

  const handleIconRemove = () => {
    setIconFile(null);
    setPreviewIconFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'cost_price',
      parseFloat(product.cost_price.replace(/[^\d.-]/g, '')),
    );
    formData.append('price', parseFloat(product.price.replace(/[^\d.-]/g, '')));
    formData.append(
      'stock',
      parseInt(
        product.stock === 'string'
          ? product.stock.replace(/\D/g, '')
          : String(product.stock || 0),
        10,
      ),
    );
    formData.append('product_name', product.product_name);
    formData.append('description', product.description);
    formData.append('category', product.category);

    // Jika ada file ikon, tambahkan ke FormData
    console.log(iconFile, ' dan ', previewIconFile);
    // return;
    if (iconFile === null) {
      formData.append('icon', 'delete');
      if (previewIconFile) {
        formData.append('icon', previewIconFile);
      }
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${product.product_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      toast({
        title: 'Berhasil.',
        description: 'Perbarui produk berhasil',
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
        'Error updating product:',
        error.response?.data || error.message,
      );
      toast({
        title: 'Gagal.',
        description: 'Gagal perbarui produk.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    setProduct(productToEdit);
    setIconFile(productToEdit.icon);
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
          <FormLabel>Nama Produk</FormLabel>
          <Input
            type="text"
            name="product_name"
            value={product?.product_name || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Nama produk harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deskripsi Biaya</FormLabel>
          <Textarea
            type="text"
            name="description"
            value={product?.description || ''}
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
          <FormLabel>Harga Biaya</FormLabel>
          <Input
            type="text"
            name="cost_price"
            value={formatCurrency(product?.cost_price) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga biaya harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Jual</FormLabel>
          <Input
            type="text"
            name="price"
            value={formatCurrency(product?.price) || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Harga jual harus diisi.')
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Stok</FormLabel>
          <Input
            type="text"
            name="stock"
            value={formatCurrency(product?.stock) || 0}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) => e.target.setCustomValidity('Stok harus diisi.')}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Kategori Produk</FormLabel>
          <Select
            name="category"
            value={product?.category || ''}
            onChange={handleChange}
            placeholder="Pilih kategori"
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
            onInvalid={(e) =>
              e.target.setCustomValidity('Kategori produk harus dipilih.')
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
            ref={fileInputRef}
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
                  ? `/assets/img/products/${iconFile}`
                  : '/assets/img/products/no-image.png'
              }
              alt={iconFile ? 'Gambar produk' : 'Gambar kosong'}
              boxSize="100px"
              objectFit="cover"
            />
            {(iconFile || previewIconFile) && (
              <IconButton
                aria-label="Hapus Ikon"
                icon={<CloseIcon />}
                position="absolute"
                top={1} // Posisi atas bisa disesuaikan
                right={1} // Posisi kanan bisa disesuaikan
                onClick={handleIconRemove}
                size="sm"
                colorScheme="red"
              />
            )}
          </Box>
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit" isDisabled={isReadOnly}>
          {isReadOnly
            ? `Kembali ke informasi dalam ${countdown} detik...`
            : 'Perbarui Produk'}
        </Button>
      </form>
    </Box>
  );
};

export default UpdateProduct;
