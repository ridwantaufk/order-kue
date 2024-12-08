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
// Custom components
import Card from 'components/card/Card.js';
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
  } = props;

  const [quantity, setQuantity] = useState(0);
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue('navy.700', 'gray.300');
  const textColorPrice = useColorModeValue('green.500', 'green.400');
  const backgroundColorInput = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('#ccc', '#cccc');

  useEffect(() => {
    if (Object.keys(selectedQuantity).length === 0) {
      setQuantity(0);
    }
  }, [selectedQuantity]);

  const onChangeValue = (e) => {
    const value = e.target.value;
    // Validasi hanya angka atau kosong
    if (/^\d*$/.test(value)) {
      setQuantity(value === '' ? null : parseInt(value));
      const newTotalPrice =
        value === ''
          ? 0
          : value * parseFloat(price.replace(/[^\d,-]/g, '').replace(',', '.'));
      if (onQuantityChange)
        onQuantityChange(id, value === '' ? 0 : parseInt(value));
      if (onTotalPriceChange) onTotalPriceChange(id, newTotalPrice);
    }
  };

  // Fungsi untuk menangani perubahan quantity
  const handleQuantityChange = (newQuantity) => {
    const newTotalPrice =
      newQuantity * parseFloat(price.replace(/[^\d,-]/g, '').replace(',', '.'));
    setQuantity(newQuantity);

    if (onQuantityChange) onQuantityChange(id, newQuantity);
    if (onTotalPriceChange) onTotalPriceChange(id, newTotalPrice);
  };

  return (
    <Card p="20px">
      <Flex direction={{ base: 'column' }} justify="center">
        {/* Image Section */}
        <Box mb={{ base: '20px', '2xl': '20px' }} position="relative">
          <Image
            src={image}
            w={{ base: '100%', '3xl': '100%' }}
            h={{ base: '100%', '3xl': '100%' }}
            borderRadius="20px"
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
            onClick={() => {
              setLike(!like);
            }}
          >
            <Icon
              transition="0.2s linear"
              w="20px"
              h="20px"
              as={like ? IoHeart : IoHeartOutline}
              color="red"
            />
          </Button>
        </Box>

        {/* Info Section */}
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex direction="column" mb="auto">
            <Text color={textColor} fontSize="xl" mb="5px" fontWeight="bold">
              {name}
            </Text>
            <Text color={textColorPrice} fontSize="md" fontWeight="700">
              {price}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="400"
              mt="10px"
            >
              {description}
            </Text>
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
              onClick={() =>
                handleQuantityChange(quantity - 1 >= 0 ? quantity - 1 : 0)
              }
            >
              -
            </Button>

            {/* Number Input */}
            <Input
              type="text"
              value={quantity === null ? '' : quantity}
              onChange={onChangeValue}
              onFocus={() => {
                if (quantity === 0) setQuantity(null);
              }}
              onBlur={() => {
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
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
