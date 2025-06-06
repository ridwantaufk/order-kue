import React from 'react';
import { Flex, Link, useColorModeValue } from '@chakra-ui/react';

const CategoryNav = ({ activeCategory, onCategoryClick }) => {
  const textColorBrand = useColorModeValue('brand.400', 'white');
  const activeColor = useColorModeValue('blue.600', 'blue.300');

  const categories = [
    { key: 'semua', label: 'Semua Menu' },
    { key: 'makanan', label: 'Makanan' },
    { key: 'minuman', label: 'Minuman' },
  ];

  return (
    <Flex
      align="center"
      me="20px"
      ms={{ base: '24px', md: '0px' }}
      mt={{ base: '20px', md: '0px' }}
    >
      {categories.map((category) => (
        <Link
          key={category.key}
          color={activeCategory === category.key ? activeColor : textColorBrand}
          fontWeight="500"
          me={{ base: '34px', md: '44px' }}
          onClick={() => onCategoryClick(category.key)}
          textShadow={
            activeCategory === category.key
              ? '1px 1px 3px rgba(52, 164, 235, 0.9)'
              : 'none'
          }
          cursor="pointer"
        >
          {category.label}
        </Link>
      ))}
    </Flex>
  );
};

export default CategoryNav;
