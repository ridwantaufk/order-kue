import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

const UpdateProduct = () => {
  const { id } = useParams(); // Mengambil id dari URL
  const [product, setProduct] = useState({
    product_name: '',
    description: '',
    price: '',
    cost_price: '',
    stock: '',
  });
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch data produk berdasarkan ID
  useEffect(() => {
    const fetchProduct = async () => {
      console.log('Fetching product with ID:', id); // Debugging ID
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );
        console.log('API Response:', response.data); // Debugging respons API
        setProduct(response.data); // Set data produk
      } catch (error) {
        console.error(
          'Error fetching product:',
          error.response ? error.response.data : error.message,
        );
        toast({
          title: 'Error.',
          description: 'Failed to load product.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProduct();
  }, [id, toast]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, product);
      toast({
        title: 'Success.',
        description: 'Product updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin/master-transaksi'); // Navigasi kembali ke daftar produk setelah berhasil
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error.',
        description: 'Failed to update product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <h1>Update Product {id}</h1>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Nama Produk</FormLabel>
          <Input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deskripsi</FormLabel>
          <Input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Biaya</FormLabel>
          <Input
            type="number"
            name="cost_price"
            value={product.cost_price}
            onChange={handleChange}
            step="0.01"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Harga Jual</FormLabel>
          <Input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Stok</FormLabel>
          <Input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Update Product
        </Button>
      </form>
    </Box>
  );
};

export default UpdateProduct;
