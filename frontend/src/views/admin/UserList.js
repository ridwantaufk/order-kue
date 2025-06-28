import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios'; // Import Axios

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mengambil data pengguna dari backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading sebelum mengambil data
      try {
        const [
          usersResponse,
          productsResponse,
          ordersResponse,
          orderItemsResponse,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orderItems`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }),
        ]);

        setUsers(usersResponse.data);
        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
        setOrderItems(orderItemsResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading false setelah semua data diambil
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        User List
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Age</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.age}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nama Produk</Th>
            <Th>Deskripsi</Th>
            <Th>Harga</Th>
            <Th>Stok</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.product_id}>
              <Td>{product.product_id}</Td>
              <Td>{product.product_name}</Td>
              <Td>{product.description}</Td>
              <Td>{product.price}</Td>
              <Td>{product.stock}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Kode Order</Th>
            <Th>Nama Pelanggan</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.order_id}>
              <Td>{order.order_id}</Td>
              <Td>{order.order_code}</Td>
              <Td>{order.customer_name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
