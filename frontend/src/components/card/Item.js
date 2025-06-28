// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import Card from 'components/card/Card.js';
import { Heart, Package, ShoppingCart } from 'lucide-react';
// Assets
import React, { useEffect, useRef, useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export default function Item(props) {
  const {
    id,
    image,
    name,
    price,
    description,
    onQuantityChange,
    onTotalPriceChange,
    selectedQuantity = {},
    hidden = false,
    stock,
  } = props;

  const [quantity, setQuantity] = useState(0);
  const [like, setLike] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const textColor = useColorModeValue('navy.700', 'gray.300');
  const textColorPrice = useColorModeValue('green.500', 'green.400');
  const backgroundColorInput = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('#ccc', '#cccc');

  const [scale, setScale] = useState(1); // Untuk kontrol scale gambar
  const lastTap = useRef(0); // Referensi untuk waktu tap terakhir

  const [bestSellerCount, setBestSellerCount] = useState(0);

  useEffect(() => {
    // Mengambil jumlah favorit dari backend saat komponen pertama kali dirender
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/favorite/${id}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      .then((response) => {
        // console.log('response util : ', response.data.favorite);
        setFavoriteCount(response.data.favorite);
      })
      .catch((error) => {
        console.log('id error :', id);
        console.error('Error fetching favorite count:', error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orderItems`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      .then((response) => {
        let totalQuantity = 0;

        response.data.forEach((item) => {
          const orderStatus = item.Order?.status?.toLowerCase() || '';
          // console.log('orderStatus : ', orderStatus);

          // Cek product_id dan status bukan "menunggu"
          if (item.product_id === id && orderStatus !== 'menunggu') {
            totalQuantity += item.quantity;
          }
        });

        setBestSellerCount(totalQuantity);
      })
      .catch((error) => {
        console.error('Error fetching order items:', error);
      });
  }, []);

  // Fungsi untuk menangani tap
  const handleDoubleTap = (button = '') => {
    // Logika untuk menangani double tap
    if (button === '') {
      const currentTime = new Date().getTime();
      const tapDelay = 300; // Ambang waktu untuk deteksi double-tap

      if (currentTime - lastTap.current < tapDelay) {
        // Jika double tap terdeteksi
        updateFavoriteCount();
        setScale(1.1); // Efek zoom saat double tap

        // Reset zoom setelah animasi selesai
        setTimeout(() => {
          setScale(1); // Kembalikan ke ukuran semula
        }, 120);
      }

      lastTap.current = currentTime;
    } else if (button === 'button') {
      // Jika parameter adalah 'button', langsung perbarui tanpa efek zoom
      updateFavoriteCount();
    }
  };

  const updateFavoriteCount = () => {
    let newFavoriteCount;

    if (like) {
      // Jika sedang di-like, maka unlike: kurangi 1 jika favoriteCount > 0
      newFavoriteCount = Math.max(favoriteCount - 1, 0);
    } else {
      // Jika belum di-like, maka like: tambahkan 1
      newFavoriteCount = favoriteCount + 1;
    }

    // Kirim request ke backend untuk memperbarui favorit
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/${id}`, {
        favorite: newFavoriteCount,
      })
      .then((response) => {
        // console.log('Favorite updated:', response.data);
        setFavoriteCount(newFavoriteCount); // Perbarui nilai favorit di state
        setLike(!like); // Toggle status like
      })
      .catch((error) => {
        console.error('Error updating favorite:', error);
      });
  };

  useEffect(() => {
    if (Object.keys(selectedQuantity).length === 0) {
      setQuantity(0);
    }
  }, [selectedQuantity]);

  const onChangeValue = (e) => {
    const value = e.target.value;

    const unitPrice = parseFloat(
      price.replace(/[^\d,-]/g, '').replace(',', '.'),
    );
    // Validasi hanya angka atau kosong
    if (/^\d*$/.test(value) && value <= stock) {
      setQuantity(value === '' ? null : parseInt(value));
      const newTotalPrice =
        value === ''
          ? 0
          : value * parseFloat(price.replace(/[^\d,-]/g, '').replace(',', '.'));
      if (onQuantityChange)
        onQuantityChange(id, value === '' ? 0 : parseInt(value));
      if (onTotalPriceChange) onTotalPriceChange(id, newTotalPrice, unitPrice);
    }
  };

  // Fungsi untuk menangani perubahan quantity
  const handleQuantityChange = (newQuantity) => {
    const unitPrice = parseFloat(
      price.replace(/[^\d,-]/g, '').replace(',', '.'),
    );

    const newTotalPrice =
      newQuantity * parseFloat(price.replace(/[^\d,-]/g, '').replace(',', '.'));
    setQuantity(newQuantity);

    if (onQuantityChange) onQuantityChange(id, newQuantity);
    if (onTotalPriceChange) onTotalPriceChange(id, newTotalPrice, unitPrice);
  };

  // console.log('stock : ', stock);

  return (
    <Card hidden={hidden} p="20px">
      <Flex direction={{ base: 'column' }} justify="center">
        {/* Image Section */}
        <Box
          mb={{ base: '20px', '2xl': '20px' }}
          position="relative"
          onClick={() => handleDoubleTap()}
        >
          <Image
            src={image}
            w={{ base: '100%', '3xl': '100%' }}
            h={{ base: '100%', '3xl': '100%' }}
            borderRadius="20px"
            maxH={{ base: '30vh', '3xl': '100%' }}
            transition="transform 0.3s ease-in-out"
            transform={`scale(${scale})`}
            className={stock <= 0 ? 'grayscale' : ''}
          />
          <Button
            position="absolute"
            bg="white"
            _hover={{ bg: 'whiteAlpha.900' }}
            _active={{ bg: 'white' }}
            _focus={{ bg: 'white' }}
            p="0px !important"
            top="14px"
            right="14px"
            borderRadius="50%"
            minW="36px"
            h="36px"
            onClick={() => handleDoubleTap('button')} // Mengubah status like
            zIndex={2}
          >
            <Icon
              transition="0.3s ease-in-out"
              w="20px"
              h="20px"
              as={like ? IoHeart : IoHeartOutline}
              color={like ? 'red' : 'gray.500'}
            />
          </Button>
        </Box>

        {/* Info Section */}
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex direction="column" mb="auto">
            <Text color={textColor} fontSize="xl" mb="5px" fontWeight="bold">
              {name}
            </Text>
            <Text
              color={textColorPrice}
              fontSize="md"
              fontWeight="700"
              className={stock <= 0 ? 'grayscale' : ''}
            >
              {price}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="400"
              mt="10px"
              h="50px"
            >
              {description}
            </Text>

            {/* Tambahan Informasi Rating dan Terlaris */}
            <Flex
              direction="row"
              align="center"
              wrap="wrap"
              gap={{ base: '8px', md: '10px' }}
              mt="10px"
              justify="center"
            >
              {/* Like */}
              <Flex align="center" gap="4px">
                <Heart size={14} color="#F56565" />
                <Text fontSize="xs" fontWeight="500">
                  {favoriteCount} Like
                </Text>
              </Flex>

              {/* Terjual */}
              <Flex align="center" gap="4px">
                <ShoppingCart size={14} color="#38A169" />
                <Text fontSize="xs" fontWeight="500">
                  Terjual: {bestSellerCount}
                </Text>
              </Flex>

              {/* Stok */}
              <Flex align="center" gap="4px">
                <Package
                  size={14}
                  color={
                    stock === 0 ? '#A0AEC0' : stock < 5 ? '#ED8936' : '#3182CE'
                  }
                />
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  color={
                    stock === 0
                      ? 'gray.500'
                      : stock < 5
                      ? 'orange.400'
                      : 'blue.500'
                  }
                >
                  Stok: {stock === 0 ? 'Habis' : stock}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Action Section */}
          <Flex align="start" justify="space-between" mt="25px" gap="10px">
            {/* Minus Button */}
            <Button
              variant="outline"
              color="red.500"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="16px"
              py="5px"
              disabled={stock <= 0}
              onClick={() => {
                if (stock <= 0) return;
                handleQuantityChange(quantity - 1 >= 0 ? quantity - 1 : 0);
              }}
            >
              -
            </Button>

            {/* Number Input */}
            <Input
              type="text"
              value={quantity === null ? '' : quantity}
              onChange={(e) => {
                if (stock <= 0) return;
                onChangeValue(e);
              }}
              onFocus={() => {
                if (stock <= 0) return;
                if (quantity === 0) setQuantity(null);
              }}
              onBlur={() => {
                if (stock <= 0) return;
                if (quantity === null || isNaN(quantity)) setQuantity(0);
              }}
              inputMode="numeric"
              width="60px"
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
              border={`1px solid ${borderColor}`}
              borderRadius="5px"
              padding="5px"
              background={backgroundColorInput}
              color={textColor}
              isDisabled={stock <= 0}
            />

            {/* Add Button */}
            <Button
              variant="outline"
              color="green.500"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="16px"
              py="5px"
              disabled={stock <= 0 || quantity >= stock}
              onClick={() => {
                if (stock <= 0) return;
                handleQuantityChange(quantity + 1);
              }}
            >
              +
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
