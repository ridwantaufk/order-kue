/*eslint-disable*/
import React from 'react';
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  let textColor = useColorModeValue('gray.300', 'gray.400');
  let hoverColor = useColorModeValue('blue.400', 'green.400');
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: 'column',
        lg: 'row',
      }}
      alignItems={{
        base: 'center',
        xl: 'start',
      }}
      justifyContent="space-between"
      px={{ base: '30px', md: '0px' }}
      pb="0px"
    >
      <Text
        color={textColor}
        textAlign={{
          base: 'center',
          xl: 'start',
        }}
        mb={{ base: '20px', lg: '0px' }}
      >
        {' '}
        &copy; {1900 + new Date().getYear()}
        <Text as="span" fontWeight="500" ms="4px">
          Dibuat Oleh Ridwan Taufik - Spesialis Javascript - Fullstack Developer
          - ReactJs, NodeJs, ExpressJs, NextJs, VueJs, PostgreSQL, RESTful API
        </Text>
      </Text>
      <List display="flex" ml={{ md: '40' }}>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            color={textColor}
            href="https://wa.me/6281312025217"
            isExternal
            _hover={{
              color: hoverColor,
            }}
          >
            WhatsApp
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            color={textColor}
            href="https://linkedin.com/in/ridwan-taufik-b3624325a"
            isExternal
            _hover={{
              color: hoverColor,
            }}
          >
            Linkedin
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            color={textColor}
            href="mailto:ridwan1998taufik@gmail.com"
            isExternal
            _hover={{
              color: hoverColor,
            }}
          >
            Email
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            color={textColor}
            href="https://www.instagram.com/ridwantaufk/"
            isExternal
            _hover={{
              color: hoverColor,
            }}
          >
            Instagram
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
