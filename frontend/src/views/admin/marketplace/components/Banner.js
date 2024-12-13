import React from 'react';

// Chakra imports
import { Button, Flex, Link, Text } from '@chakra-ui/react';

// Assets
import banner from 'assets/img/nfts/NftBanner1.png';
import axios from 'axios';

export default function Banner({
  setProducts,
  setSelectedQuantity,
  setSelectedTotalPrice,
  setActiveCategory,
  setSearchKeyword,
  setTerlaris,
}) {
  const fetchProducts = async () => {
    try {
      // Fetch data dari endpoint products dan orderItems
      const responseProducts = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      );

      const responseOrderItems = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orderItems`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      );

      // Ambil data orderItems untuk menghitung total quantity setiap product_id
      const orderItems = responseOrderItems.data;

      // Menghitung akumulasi quantity per product_id
      const quantityByProductId = orderItems.reduce((acc, item) => {
        acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
        return acc;
      }, {});

      // Gabungkan data produk dengan informasi total quantity
      const productsWithPopularity = responseProducts.data.map((product) => ({
        ...product,
        totalQuantity: quantityByProductId[product.product_id] || 0,
      }));

      // Urutkan produk berdasarkan total quantity (terlaris di atas)
      const sortedData = productsWithPopularity.sort(
        (a, b) => b.totalQuantity - a.totalQuantity,
      );

      // Perbarui state
      setProducts(sortedData);
      setSelectedQuantity({});
      setSelectedTotalPrice({});
      setActiveCategory('');
      setSearchKeyword('');
      setTerlaris(true);

      // console.log('Produk terlaris (sorted):', sortedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      // Ambil data dari tabel m_products dan t_utils_product
      const responseProducts = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      );

      const responseFavorites = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/favorite`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      );

      // Gabungkan data produk dengan data favorit berdasarkan product_id
      const favoritesData = responseFavorites.data;
      const productsData = responseProducts.data;

      const favoriteProducts = productsData
        .map((product) => {
          const favorite = favoritesData.find(
            (fav) => fav.product_id === product.product_id,
          );
          return {
            ...product,
            favorite: favorite ? favorite.favorite : 0,
          };
        })
        .filter((product) => product.favorite > 0); // Filter produk dengan favorit > 0

      // Urutkan berdasarkan nilai favorit (tertinggi ke terendah)
      const sortedFavorites = favoriteProducts.sort(
        (a, b) => b.favorite - a.favorite,
      );

      // Perbarui state
      setProducts(sortedFavorites);
      setSelectedQuantity({});
      setSelectedTotalPrice({});
      setActiveCategory('');
      setSearchKeyword('');
      setTerlaris(true);

      // console.log('Produk Favorit:', sortedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Chakra Color Mode
  return (
    <Flex
      direction="column"
      bgImage={banner}
      bgSize="cover"
      py={{ base: '30px', md: '56px' }}
      px={{ base: '30px', md: '64px' }}
      borderRadius="30px"
    >
      <Text
        fontSize={{ base: '24px', md: '34px' }}
        color="white"
        mb="14px"
        maxW={{
          base: '100%',
          md: '64%',
          lg: '46%',
          xl: '70%',
          '2xl': '50%',
          '3xl': '42%',
        }}
        fontWeight="700"
        lineHeight={{ base: '32px', md: '42px' }}
      >
        Brownies Hangat, Manis dalam Setiap Gigitan !
      </Text>
      <Text
        fontSize="md"
        color="#E3DAFF"
        maxW={{
          base: '100%',
          md: '64%',
          lg: '40%',
          xl: '56%',
          '2xl': '46%',
          '3xl': '34%',
        }}
        fontWeight="500"
        mb="40px"
        lineHeight="28px"
      >
        Pesan Sekarang, Tunggu dan Nikmati Segera!
      </Text>
      <Flex align="center">
        <Button
          bg="white"
          color="black"
          _hover={{ bg: 'whiteAlpha.900' }}
          _active={{ bg: 'white' }}
          _focus={{ bg: 'white' }}
          fontWeight="500"
          fontSize="14px"
          py="20px"
          px="27"
          me="38px"
          onClick={fetchProducts}
        >
          Terlaris
        </Button>
        <Link onClick={fetchFavorites}>
          <Text color="white" fontSize="sm" fontWeight="500">
            Favorit
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
}
