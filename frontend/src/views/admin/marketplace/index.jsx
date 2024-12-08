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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  CloseButton,
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
  const [totQuantity, setTotQuantity] = useState(0);
  const [totPrice, setTotPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [temporaryQuantity, setTemporaryQuantity] = useState({});
  const [temporaryPrice, setTemporaryPrice] = useState({});
  const [deleteInput, setDeleteInput] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({
    quantity: 0,
    price: 0,
  });
  const toast = useToast();
  const toastId = useRef(null);
  const deleteInputRef = useRef(deleteInput);

  useEffect(() => {
    // Cleanup ketika komponen dilepas (unmount) -- fungsi ini ketika user pindah halaman beda file
    return () => {
      if (toastId.current) {
        toast.close(toastId.current);
        toastId.current = null;
      }
      setSelectedQuantity({});
      setSelectedTotalPrice({});
    };
  }, []);

  useEffect(() => {
    deleteInputRef.current = deleteInput;
  }, [deleteInput]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`,
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
    // Hitung total quantity dan total price
    const totalQuantity = Object.values(selectedQuantity).reduce(
      (acc, cur) => acc + cur,
      0,
    );

    const totalPrice = Object.values(selectedTotalPrice).reduce(
      (acc, cur) => acc + cur,
      0,
    );

    setTotQuantity(totalQuantity);
    setTotPrice(totalPrice);
    if (
      Object.keys(selectedQuantity).length > 0 &&
      Object.keys(selectedTotalPrice).length > 0
    ) {
      setTemporaryQuantity(selectedQuantity);
      setTemporaryPrice(selectedTotalPrice);
    }
  }, [selectedQuantity, selectedTotalPrice]);

  useEffect(() => {
    // console.log('quantity : ', totQuantity, 'totalprice : ', totPrice);

    if (totQuantity > 0) {
      if (toastId.current) {
        // Update toast jika sudah ada
        toast.update(toastId.current, {
          render: () => (
            <Box
              style={{
                position: 'relative',
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: '#6831f5',
                borderRadius: '8px',
                border: '1px solid #6831f5',
              }}
              onClick={() => {
                handleToastClick();
              }}
            >
              <CloseButton
                position="absolute"
                top="8px"
                right="8px"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah propagasi event klik ke Box
                  // setSelectedQuantity({});
                  // setSelectedTotalPrice({});
                  toast.close(toastId.current);
                  toastId.current = null;
                }}
              />
              <div>
                <strong style={{ color: '#eeebf5' }}>
                  Jumlah Dipesan: {totQuantity}
                </strong>
              </div>
              <div style={{ color: '#eeebf5' }}>
                Total Harga: Rp {totPrice.toLocaleString('id-ID')}
              </div>
              <div
                style={{
                  marginTop: '10px',
                  color: '#a5a6f2', // Menyesuaikan warna teks dengan background
                  fontSize: '12px',
                }}
              >
                Klik untuk melanjutkan.
              </div>
            </Box>
          ),
          status: 'info',
          duration: null,
          isClosable: true, // Masih aktifkan close
          position: 'bottom',
          variant: 'subtle',
          containerStyle: {
            width: '400px',
            height: 'auto',
            cursor: 'pointer',
          },
        });
      } else {
        // Tampilkan toast baru jika belum ada
        toastId.current = toast({
          render: () => (
            <Box
              style={{
                position: 'relative',
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: '#6831f5',
                borderRadius: '8px',
                border: '1px solid #6831f5',
              }}
              onClick={() => {
                handleToastClick();
              }}
            >
              <CloseButton
                position="absolute"
                top="8px"
                right="8px"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah propagasi event klik ke Box
                  // setSelectedQuantity({});
                  // setSelectedTotalPrice({});
                  toast.close(toastId.current);
                  toastId.current = null;
                }}
              />
              <div>
                <strong style={{ color: '#eeebf5' }}>
                  Jumlah Dipesan: {totQuantity}
                </strong>
              </div>
              <div style={{ color: '#eeebf5' }}>
                Total Harga: Rp {totPrice.toLocaleString('id-ID')}
              </div>
              <div
                style={{
                  marginTop: '10px',
                  color: '#a5a6f2', // Menyesuaikan warna teks dengan background
                  fontSize: '12px',
                }}
              >
                Klik untuk melanjutkan.
              </div>
            </Box>
          ),
          status: 'info',
          duration: null,
          isClosable: true, // Masih aktifkan close
          position: 'bottom',
          variant: 'subtle',
          onCloseComplete: () => {
            if (deleteInputRef.current) {
              setSelectedQuantity({});
              setSelectedTotalPrice({});
            }
          },
          containerStyle: {
            width: '400px',
            height: 'auto',
            cursor: 'pointer',
          },
        });
      }
    } else if (totQuantity === 0 && toastId.current) {
      // Tutup toast jika quantity == 0
      toast.close(toastId.current);
      toastId.current = null;
    }
  }, [totQuantity, totPrice]);

  // Fungsi untuk menangani klik pada toast
  const handleToastClick = () => {
    setPaymentDetails({
      quantity: totQuantity,
      price: totPrice,
    });
    setTotQuantity(0);
    setTotPrice(0);
    setIsModalOpen(true);
    setDeleteInput(false);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setDeleteInput(true);
    setIsModalOpen(false);
    console.log('temporaryQuantity : ', temporaryQuantity);
    setSelectedQuantity(temporaryQuantity);
    setSelectedTotalPrice(temporaryPrice);
    setTotQuantity(
      Object.values(temporaryQuantity).reduce((acc, cur) => acc + cur, 0),
    );
    setTotPrice(
      Object.values(temporaryPrice).reduce((acc, cur) => acc + cur, 0),
    );
    console.log('totQuantity, totPrice : ', totQuantity, ' ', totPrice);
    console.log('deleteInputRefclosemodal : ', deleteInputRef.current);
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

  // Fungsi untuk menangani perubahan quantity
  const handleQuantityChange = (id, newQuantity) => {
    setSelectedQuantity((prevData) => {
      const updatedData = { ...prevData };
      updatedData[id] = newQuantity;
      // return;
      return updatedData;
    });
  };

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
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent maxWidth="1000px" height="80vh">
          <ModalHeader>Detail Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Jumlah Pesanan: {paymentDetails.quantity}</Text>
            <Text>
              Total Harga: Rp {paymentDetails.price.toLocaleString('id-ID')}
            </Text>
            {/* Add other payment details here */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Tutup
            </Button>
            <Button variant="ghost">Proses Pembayaran</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
                  selectedQuantity={selectedQuantity}
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
