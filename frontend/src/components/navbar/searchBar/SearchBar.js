import React, { useState } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useSearchStore } from 'components/search/searchStore';
import { useLocation } from 'react-router-dom';

export function SearchBar(props) {
  const location = useLocation();
  const { variant, background, placeholder, borderRadius, ...rest } = props;
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  const searchIconColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const inputText = useColorModeValue('gray.700', 'gray.100');

  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputGroup
      w={{ base: '100%', md: isFocused ? '300px' : '200px' }}
      transition="width 0.3s ease-in-out"
      {...rest}
    >
      <InputLeftElement>
        <IconButton
          bg="inherit"
          borderRadius="inherit"
          _hover={{ transform: 'scale(1.1)' }}
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{ boxShadow: 'none' }}
          icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          aria-label="Search"
        />
      </InputLeftElement>
      <Input
        variant="search"
        fontSize="sm"
        bg={
          !location.pathname !== '/admin/data-tables' ||
          !location.pathname !== '/orderan'
            ? inputBg
            : background || inputBg
        }
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: 'gray.400', fontSize: '14px' }}
        borderRadius={borderRadius || '30px'}
        placeholder={placeholder || 'Search...'}
        onFocus={() =>
          !location.pathname !== '/admin/data-tables' &&
          !location.pathname !== '/orderan' &&
          setIsFocused(true)
        }
        onBlur={() =>
          !location.pathname !== '/admin/data-tables' &&
          !location.pathname !== '/orderan' &&
          setIsFocused(false)
        }
        onChange={(e) =>
          !location.pathname !== '/admin/data-tables' &&
          !location.pathname !== '/orderan' &&
          setSearchTerm(e.target.value)
        }
        disabled={
          location.pathname !== '/admin/data-tables' &&
          location.pathname !== '/orderan'
        }
      />
    </InputGroup>
  );
}
