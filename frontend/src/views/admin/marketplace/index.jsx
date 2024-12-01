import React, { useEffect, useRef, useState } from 'react';

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
  Spinner,
  useToast,
} from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';
import TableTopCreators from 'views/admin/marketplace/components/TableTopCreators';
import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import Item from 'components/card/Item';
import Card from 'components/card/Card.js';

// Assets
import Nft1 from 'assets/img/nfts/Nft1.png';
import Nft2 from 'assets/img/nfts/Nft2.png';
import Nft3 from 'assets/img/nfts/Nft3.png';
import Nft4 from 'assets/img/nfts/Nft4.png';
import Nft5 from 'assets/img/nfts/Nft5.png';
import Nft6 from 'assets/img/nfts/Nft6.png';
import Avatar1 from 'assets/img/avatars/avatar1.png';
import Avatar2 from 'assets/img/avatars/avatar2.png';
import Avatar3 from 'assets/img/avatars/avatar3.png';
import Avatar4 from 'assets/img/avatars/avatar4.png';
import tableDataTopCreators from 'views/admin/marketplace/variables/tableDataTopCreators.json';
import { tableColumnsTopCreators } from 'views/admin/marketplace/variables/tableColumnsTopCreators';
import axios from 'axios';

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [selectedTotalPrice, setSelectedTotalPrice] = useState({});
  const toast = useToast();
  const toastId = useRef(null);

  const totalQuantity = Object.values(selectedQuantity).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  const totalPrice = Object.values(selectedTotalPrice).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  console.log('quantity : ', totalQuantity, 'totalprice : ', totalPrice);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://1590-149-113-194-138.ngrok-free.app/api/products',
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        console.log('response.data : ', response.data);

        // Sort data
        const sortedData = response.data.sort((a, b) =>
          a.product_name.localeCompare(b.product_name),
        );

        setProducts(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedQuantity).length > 0 && !toastId.current) {
      // Show the toast and save its id in the ref
      toastId.current = toast({
        title: `Jumlah Dipesan: ${totalQuantity}`,
        description: `Total Harga: Rp ${totalPrice.toLocaleString('id-ID')}`,
        status: 'info',
        duration: null, // Toast will not close automatically
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
        onCloseComplete: () => {
          // Reset selectedQuantity and selectedTotalPrice when toast is closed
          setSelectedQuantity({});
          setSelectedTotalPrice({});
        },
        containerStyle: {
          width: '400px', // Set custom width
          height: 'auto', // Adjust height (auto will let it adjust based on content)
        },
      });
    } else if (Object.keys(selectedQuantity).length === 0 && toastId.current) {
      // If quantity is 0, close the toast and reset states
      toast.close(toastId.current);
      toastId.current = null; // Reset the toast id
    }
  }, [selectedQuantity, selectedTotalPrice, toast]);

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

  // Fungsi untuk menangani perubahan quantity
  const handleQuantityChange = (id, newQuantity) => {
    setSelectedQuantity((prevData) => {
      const updatedData = { ...prevData };
      updatedData[id] = newQuantity;
      // return;
      return updatedData;
    });
    console.log('SelectedQuantity : ', selectedQuantity);
  };

  useEffect(() => {
    console.log('SelectedQuantity updated:', selectedQuantity);
  }, [selectedQuantity, selectedTotalPrice]);

  // Fungsi untuk menangani perubahan totalPrice
  const handleTotalPriceChange = (id, newTotalPrice) => {
    setSelectedTotalPrice((prevData) => {
      const updatedData = { ...prevData };
      updatedData[id] = newTotalPrice;
      // return;
      return updatedData;
    });
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
        >
          <Banner />
          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'start', md: 'center' }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Pilih Menu
              </Text>
              <Flex
                align="center"
                me="20px"
                ms={{ base: '24px', md: '0px' }}
                mt={{ base: '20px', md: '0px' }}
              >
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#art"
                >
                  Semua Menu
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#art"
                >
                  Makanan
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#music"
                >
                  Minuman
                </Link>
              </Flex>
            </Flex>

            <SimpleGrid
              columns={{ base: 2, md: 3 }} // 2 columns on mobile (base), 3 on medium screens and above
              gap="20px" // Space between items
            >
              {products.map((product) => (
                <Item
                  key={product.product_id}
                  id={product.product_id}
                  name={product.product_name}
                  price={`${formatCurrency(product.price)}`}
                  description={product.description}
                  image={
                    product.icon
                      ? `/assets/img/products/${product.icon}`
                      : '/assets/img/products/no-image.png'
                  }
                  onQuantityChange={handleQuantityChange}
                  onTotalPriceChange={handleTotalPriceChange}
                />
              ))}
            </SimpleGrid>

            <Text
              mt="45px"
              mb="36px"
              color={textColor}
              fontSize="2xl"
              ms="24px"
              fontWeight="700"
            >
              Recently Added
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap="20px"
              mb={{ base: '20px', xl: '0px' }}
            >
              <Item
                name="Swipe Circles"
                author="By Peter Will"
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft4}
                currentbid="0.91 ETH"
                download="#"
              />
              <Item
                name="Colorful Heaven"
                author="By Mark Benjamin"
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft5}
                currentbid="0.91 ETH"
                download="#"
              />
              <Item
                name="3D Cubes Art"
                author="By Manny Gates"
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft6}
                currentbid="0.91 ETH"
                download="#"
              />
            </SimpleGrid>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        >
          <Card px="0px" mb="20px">
            <TableTopCreators
              tableData={tableDataTopCreators}
              columnsData={tableColumnsTopCreators}
            />
          </Card>
          <Card p="0px">
            <Flex
              align={{ sm: 'flex-start', lg: 'center' }}
              justify="space-between"
              w="100%"
              px="22px"
              py="18px"
            >
              <Text color={textColor} fontSize="xl" fontWeight="600">
                History
              </Text>
              <Button variant="action">See all</Button>
            </Flex>

            <HistoryItem
              name="Colorful Heaven"
              author="By Mark Benjamin"
              date="30s ago"
              image={Nft5}
              price="0.91 ETH"
            />
            <HistoryItem
              name="Abstract Colors"
              author="By Esthera Jackson"
              date="58s ago"
              image={Nft1}
              price="0.91 ETH"
            />
            <HistoryItem
              name="ETH AI Brain"
              author="By Nick Wilson"
              date="1m ago"
              image={Nft2}
              price="0.91 ETH"
            />
            <HistoryItem
              name="Swipe Circles"
              author="By Peter Will"
              date="1m ago"
              image={Nft4}
              price="0.91 ETH"
            />
            <HistoryItem
              name="Mesh Gradients "
              author="By Will Smith"
              date="2m ago"
              image={Nft3}
              price="0.91 ETH"
            />
            <HistoryItem
              name="3D Cubes Art"
              author="By Manny Gates"
              date="3m ago"
              image={Nft6}
              price="0.91 ETH"
            />
          </Card>
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
