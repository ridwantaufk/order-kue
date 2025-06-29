'use client';
/* eslint-disable */

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Checkbox,
  HStack,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Image,
  Badge,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function ViewProduct({ onEdit }) {
  const [products, setProducts] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [productToDelete, setProductToDelete] = React.useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const rowBgColorTr = useColorModeValue('red.100', 'red.300');
  const rowBgColorTd = useColorModeValue('gray.500', 'gray.300');

  const handleDeleteClick = (product = null) => {
    setProductToDelete(product);
    setIsOpen(true);
  };

  const deleteSelectedProducts = async () => {
    try {
      const productsToDelete =
        selectedProducts.length > 0 ? selectedProducts : [productToDelete];

      if (!productToDelete && productsToDelete.length === 0) {
        throw new Error('Tidak ada produk yang dipilih untuk dihapus.');
      }

      await Promise.all(
        productsToDelete.map(async (product) => {
          if (product.product_id) {
            // Pastikan product_id valid
            await axios.put(
              `${process.env.REACT_APP_BACKEND_URL}/api/products/delete/${product.product_id}`,
              {
                stock: 0,
                available: false,
              },
            );
          } else {
            throw new Error(
              `Product ID tidak valid untuk produk ${product.product_name}`,
            );
          }
        }),
      );

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          productsToDelete.some(
            (selected) => selected.product_id === p.product_id,
          )
            ? { ...p, stock: 0, available: false }
            : p,
        ),
      );

      toast({
        title: 'Dihapus!',
        description: `${productsToDelete.length} produk telah dihapus.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setSelectedProducts([]);
      setIsAllSelected(false);
      setProductToDelete(null);
    } catch (error) {
      console.error(
        'Error deleting products:',
        error.response ? error.response.data : error.message,
      );
      toast({
        title: 'Error.',
        description:
          'Gagal menghapus produk: ' +
          (error.response ? error.response.data.message : error.message),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true', // gara-gara baris nu kieu patut beak mikiran
            },
          },
        );
        const sortedProducts = response.data.sort((a, b) =>
          a.product_name.localeCompare(b.product_name),
        );
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error.response);
        toast({
          title: 'Error.',
          description: 'Failed to load products.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchProducts();
  }, []);

  React.useEffect(() => {
    const allProducts = products.filter(
      (product) => product.stock > 0 && product.available,
    );
    setIsAllSelected(
      allProducts.length > 0 &&
        allProducts.every((product) =>
          selectedProducts.some(
            (selected) => selected.product_id === product.product_id,
          ),
        ),
    );
  }, [selectedProducts, products]);

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);

    const sortedProducts = [...products].sort((a, b) => {
      const isNumericColumn = ['cost_price', 'price', 'stock'].includes(column);
      const valA = isNumericColumn
        ? parseFloat(a[column])
        : a[column].toLowerCase();
      const valB = isNumericColumn
        ? parseFloat(b[column])
        : b[column].toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
  };

  const formatCurrency = (value) => {
    if (value == null) return 'Rp 0';
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  const formatStock = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSelectAll = () => {
    const allProducts = products.filter(
      (product) => product.stock > 0 && product.available,
    );
    if (isAllSelected) {
      // Jika semua sudah tercentang, hapus semua pilihan
      setSelectedProducts([]);
    } else {
      // Ambil semua produk yang tidak memiliki stock 0 dan tidak tersedia
      setSelectedProducts(allProducts);
    }
  };

  const handleSelectProduct = (product) => {
    if (
      selectedProducts.some(
        (selected) => selected.product_id === product.product_id,
      )
    ) {
      setSelectedProducts(
        selectedProducts.filter(
          (selected) => selected.product_id !== product.product_id,
        ),
      );
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <Box w="100%" p={4}>
      <Button
        colorScheme="red"
        onClick={handleDeleteClick}
        isDisabled={selectedProducts.length === 0}
        mb={4}
      >
        Hapus Terpilih
      </Button>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={isAllSelected}
                onChange={handleSelectAll}
                colorScheme="red"
              />
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('product_name')}>
              Nama Produk
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('description')}>
              Deskripsi Produk
            </Th>
            <Th
              cursor="pointer"
              isNumeric
              onClick={() => handleSort('cost_price')}
            >
              Harga Biaya
            </Th>
            <Th cursor="pointer" isNumeric onClick={() => handleSort('price')}>
              Harga Jual
            </Th>
            <Th cursor="pointer" isNumeric onClick={() => handleSort('stock')}>
              Stok
            </Th>
            <Th>Kategori</Th>
            <Th>Gambar</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr
              key={product.product_id}
              bg={
                product.stock <= 0 && product.available === false
                  ? rowBgColorTr
                  : undefined
              }
            >
              <Td>
                <Checkbox
                  isChecked={selectedProducts.some(
                    (selected) => selected.product_id === product.product_id,
                  )}
                  onChange={() => handleSelectProduct(product)}
                  colorScheme="red"
                  isDisabled={product.stock <= 0 && !product.available}
                />
              </Td>
              <Td
                textDecoration={
                  product.stock <= 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                color={
                  product.stock <= 0 && product.available === false
                    ? rowBgColorTd
                    : undefined
                }
              >
                {product.product_name}
              </Td>
              <Td
                textDecoration={
                  product.stock <= 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                color={
                  product.stock <= 0 && product.available === false
                    ? rowBgColorTd
                    : undefined
                }
              >
                {product.description}
              </Td>
              <Td
                textDecoration={
                  product.stock <= 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
                color={
                  product.stock <= 0 && product.available === false
                    ? rowBgColorTd
                    : undefined
                }
              >
                {formatCurrency(product.cost_price)}{' '}
              </Td>
              <Td
                textDecoration={
                  product.stock <= 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
                color={
                  product.stock <= 0 && product.available === false
                    ? rowBgColorTd
                    : undefined
                }
              >
                {formatCurrency(product.price)}{' '}
              </Td>
              <Td
                textDecoration={
                  product.stock <= 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                isNumeric
                color={
                  product.stock <= 0 && product.available === false
                    ? rowBgColorTd
                    : undefined
                }
              >
                {formatStock(product.stock)}{' '}
              </Td>
              <Td
                textDecoration={
                  product.stock <= 0 && product.available === false
                    ? 'line-through'
                    : 'none'
                }
                color={
                  product.stock <= 0 && product.available === false
                    ? rowBgColorTd
                    : undefined
                }
              >
                <Badge
                  colorScheme={
                    product.category === 'makanan'
                      ? 'green'
                      : product.category === 'minuman'
                      ? 'blue'
                      : 'gray'
                  }
                >
                  {product.category === 'makanan'
                    ? 'Makanan'
                    : product.category === 'minuman'
                    ? 'Minuman'
                    : 'Lainnya'}
                </Badge>
              </Td>

              <Td>
                <Image
                  src={
                    product.icon
                      ? `/assets/img/products/${product.icon}`
                      : '/assets/img/products/no-image.png'
                  }
                  alt={
                    product.icon
                      ? `Icon ${product.name}`
                      : 'Gambar Tidak Ditemukan'
                  }
                  boxSize="50px"
                  objectFit="cover"
                  filter={
                    product.stock <= 0 && product.available === false
                      ? 'grayscale(100%)'
                      : 'none'
                  }
                  onError={(e) => {
                    e.target.src = '/assets/img/products/no-image.png';
                  }}
                />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button colorScheme="blue" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteClick(product)}
                    isDisabled={
                      product.stock <= 0 && product.available === false
                    }
                  >
                    Hapus
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setIsOpen(false);
          setProductToDelete(null); // Reset when closing
        }}
      >
        <AlertDialogOverlay
          bg="rgba(0, 0, 0, 0.8)"
          sx={{ backdropFilter: 'blur(1px)' }}
        >
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Produk
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus{' '}
              {productToDelete?.product_name
                ? `produk "${productToDelete.product_name}" `
                : `${selectedProducts.length} produk `}
              ? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={deleteSelectedProducts} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
