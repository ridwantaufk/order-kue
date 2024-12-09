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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  ButtonGroup,
  useDisclosure,
  IconButton,
  useClipboard,
  useBreakpointValue,
  Divider,
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
import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';

import { openPrintWindow } from './print/print';
import { QRCodeCanvas } from 'qrcode.react';

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const backgroundColor = useColorModeValue('gray.50', 'gray.700');
  const separatorLine = useColorModeValue('gray.300', '#ccc');
  const nameTextColor = useColorModeValue('navy.700', '#ccc');
  const nameTextColorDisabled = useColorModeValue('navy.700', 'gray.200');
  const nameBackgroundColor = useColorModeValue('white', 'gray.700');
  const nameBackgroundColorDisabled = useColorModeValue('#cccc', 'gray.600');
  const qrCodeSize = useBreakpointValue({ base: 150, md: 250, lg: 300 });

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
    itemQuantity: {},
    itemPrice: {},
    quantity: 0,
    price: 0,
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Menggunakan useClipboard untuk setiap item yang ingin disalin
  const { onCopy: onCopyOrderID, hasCopied: hasCopiedOrderID } = useClipboard(
    paymentInfo?.orderID,
  );
  const { onCopy: onCopyVANumber, hasCopied: hasCopiedVANumber } = useClipboard(
    paymentInfo?.vaNumber,
  );
  const { onCopy: onCopyAmount, hasCopied: hasCopiedAmount } = useClipboard(
    paymentInfo?.amount.toLocaleString('id-ID'),
  );

  // State untuk mengatur visibilitas dan status "Disalin!"
  const [showCopiedOrderID, setShowCopiedOrderID] = useState(false);
  const [showCopiedVANumber, setShowCopiedVANumber] = useState(false);
  const [showCopiedAmount, setShowCopiedAmount] = useState(false);

  // State untuk menyembunyikan informasi saat tombol salin ditekan
  const [hideOrderID, setHideOrderID] = useState(false);
  const [hideVANumber, setHideVANumber] = useState(false);
  const [hideAmount, setHideAmount] = useState(false);

  const handleCopyOrderID = () => {
    onCopyOrderID();
    setShowCopiedOrderID(true);
    setHideOrderID(true);
    setTimeout(() => {
      setShowCopiedOrderID(false);
      setHideOrderID(false);
    }, 700);
  };

  const handleCopyVANumber = () => {
    onCopyVANumber();
    setShowCopiedVANumber(true);
    setHideVANumber(true);
    setTimeout(() => {
      setShowCopiedVANumber(false);
      setHideVANumber(false);
    }, 700);
  };

  const handleCopyAmount = () => {
    onCopyAmount();
    setShowCopiedAmount(true);
    setHideAmount(true);
    setTimeout(() => {
      setShowCopiedAmount(false);
      setHideAmount(false);
    }, 700);
  };

  const toast = useToast();
  const toastId = useRef(null);
  const deleteInputRef = useRef(deleteInput);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
      itemQuantity: selectedQuantity,
      itemPrice: selectedTotalPrice,
      quantity: totQuantity,
      price: totPrice,
    });
    console.log('paymentDetails : ', paymentDetails);
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

  const processPayment = () => {
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    if (disabled) {
      return onOpen();
    }

    setIsPaymentModalOpen(false);
  };

  const handleNavigate = () => {
    window.location.replace('/orderan');
  };

  const handlePrint = () => {
    openPrintWindow(paymentInfo);
  };

  const handlePaymentBCA = async () => {
    try {
      if (!customerName.trim()) {
        setIsNameInvalid(true);
        toast({
          title: 'Nama Pemesan Kosong',
          description: 'Harap isi nama pemesan sebelum melanjutkan pembayaran.',
          status: 'error', // Warna merah untuk error
          duration: 5000, // Durasi dalam milidetik (5 detik)
          isClosable: true, // Dapat ditutup oleh pengguna
          position: 'top-right', // Posisi toast di layar
        });
        return;
      }
      setDisabled(true);
      setIsNameInvalid(false);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/create`,
        {
          amount: paymentDetails.price,
          customerName: 'John Doe',
        },
      );

      setPaymentInfo(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Gagal membuat Virtual Account');
    }
  };

  const handlePaymentDANA = () => {};

  const payment = () => {
    console.log('test : ');
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
        <ModalContent
          maxWidth={{ base: '98%', md: '768px', lg: '1000px' }}
          height="90vh"
          overflow="auto"
        >
          <ModalHeader>Detail Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            overflowY="auto" // Mengaktifkan scroll vertikal jika konten melebihi tinggi
            height="calc(90vh - 100px)"
          >
            <Box overflowX="auto" overflowY="auto">
              <Table variant="simple" size="sm" margin="auto" fontSize="sm">
                <Thead>
                  <Tr>
                    <Th>Nama Produk</Th>
                    <Th>Jumlah</Th>
                    <Th>Harga Satuan</Th>
                    <Th>Total Harga</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(paymentDetails.itemQuantity).map(
                    ([key, value]) => {
                      // Konversi key ke number untuk mencocokkan dengan product_id
                      const matchedProduct = products.find(
                        (product) => product.product_id === Number(key),
                      );

                      if (matchedProduct) {
                        const itemPrice =
                          paymentDetails.itemPrice[key]?.toLocaleString(
                            'id-ID',
                          ) || '0';
                        const totalPrice =
                          (
                            value * paymentDetails.itemPrice[key]
                          )?.toLocaleString('id-ID') || '0';

                        return (
                          <Tr key={key}>
                            <Td fontSize="sm">{matchedProduct.product_name}</Td>
                            <Td fontSize="sm">{value}</Td>
                            <Td fontSize="sm">Rp. {itemPrice}</Td>
                            <Td fontSize="sm">Rp. {totalPrice}</Td>
                          </Tr>
                        );
                      }

                      return (
                        <Tr key={key}>
                          <Td fontSize="sm">Produk dengan ID {key}</Td>
                          <Td fontSize="sm">-</Td>
                          <Td fontSize="sm">-</Td>
                          <Td fontSize="sm">-</Td>
                        </Tr>
                      );
                    },
                  )}
                </Tbody>
                <Tfoot>
                  <Tr borderTop="2px solid" borderColor={separatorLine} mt={4}>
                    <Th fontSize="sm">Total</Th>
                    <Th fontSize="sm">{paymentDetails.quantity}</Th>
                    <Th fontSize="sm">-</Th>
                    <Th fontSize="sm">
                      Rp. {paymentDetails.price.toLocaleString('id-ID')}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button rounded={20} colorScheme="blue" mr={5} onClick={closeModal}>
              Kembali
            </Button>
            <Button onClick={processPayment} variant="ghost" c>
              Proses Pembayaran
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* proses pembayaran */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        size="xl"
        isCentered
        isLazy
      >
        <ModalOverlay backdropFilter="blur(1.5px)" />
        <ModalContent
          maxWidth={{ base: '98%', md: '768px', lg: '1000px' }}
          height="90vh"
          overflowY="auto"
        >
          <ModalHeader color={nameTextColor}>Proses Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Judul Section */}
              {!disabled && (
                <>
                  <Box textAlign="center" mb={4}>
                    <Heading
                      size="md"
                      fontSize={{ base: 'lg', sm: 'md', md: 'xl' }}
                      color={nameTextColor}
                    >
                      Pilih Metode Pembayaran
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      Pilih metode pembayaran yang Anda inginkan untuk
                      melanjutkan transaksi
                    </Text>
                  </Box>
                </>
              )}

              {/* Input Nama */}
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="sm"
                bg={backgroundColor}
              >
                <Text fontWeight="bold" mb={3} color={nameTextColor}>
                  {disabled
                    ? 'Informasi Pemesan'
                    : 'Masukkan Informasi Pemesan'}
                </Text>
                <FormControl
                  id="customer-name"
                  isRequired
                  isInvalid={isNameInvalid}
                  mb={4}
                >
                  <FormLabel color={nameTextColor}>Nama Pemesan</FormLabel>
                  <Input
                    placeholder="Masukkan nama pemesan"
                    focusBorderColor="blue.400"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onFocus={() => setIsNameInvalid(false)}
                    disabled={disabled}
                    background={
                      disabled
                        ? nameBackgroundColorDisabled
                        : nameBackgroundColor
                    }
                    textColor={disabled ? nameTextColorDisabled : nameTextColor}
                  />
                  {isNameInvalid && (
                    <Text color="red.500" fontSize="sm">
                      Nama pemesan harus diisi.
                    </Text>
                  )}
                </FormControl>
              </Box>

              {/* Tombol Metode Pembayaran */}
              {!disabled && (
                <ButtonGroup
                  spacing={4}
                  width="100%"
                  direction={{ base: 'column', sm: 'row' }}
                >
                  <Button
                    onClick={handlePaymentBCA}
                    colorScheme="blue"
                    width="100%"
                    size={{ base: 'md', sm: 'lg' }} // Menyesuaikan ukuran tombol
                    fontSize={{ base: 'sm', sm: 'md' }} // Menyesuaikan ukuran font
                    boxShadow="md"
                    whiteSpace="normal" // Mengizinkan teks untuk membungkus jika perlu
                    wordBreak="break-word" // Memastikan kata-kata terpisah jika terlalu panjang
                  >
                    Bayar dengan Bank BCA
                  </Button>
                  <Button
                    onClick={handlePaymentDANA}
                    colorScheme="orange"
                    width="100%"
                    size={{ base: 'md', sm: 'lg' }} // Menyesuaikan ukuran tombol
                    fontSize={{ base: 'sm', sm: 'md' }} // Menyesuaikan ukuran font
                    boxShadow="md"
                    whiteSpace="normal" // Mengizinkan teks untuk membungkus jika perlu
                    wordBreak="break-word" // Memastikan kata-kata terpisah jika terlalu panjang
                  >
                    Bayar dengan DANA
                  </Button>
                </ButtonGroup>
              )}

              {/* Tampilan Informasi Pembayaran */}
              {paymentInfo !== null && (
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  boxShadow="sm"
                  bg={backgroundColor}
                  width="100%"
                  margin="0 auto"
                >
                  <Text fontWeight="bold" mb={2}>
                    Informasi Virtual Account Anda
                  </Text>

                  {/* Order ID */}
                  <Flex justifyContent="space-between" mb={1} align="center">
                    <Text>Order ID:</Text>
                    <Flex align="center">
                      {!hideOrderID && (
                        <>
                          <Text fontWeight="medium">{paymentInfo.orderID}</Text>
                          <IconButton
                            aria-label="Salin Order ID"
                            icon={<CopyIcon />}
                            size="sm"
                            ml={2}
                            onClick={handleCopyOrderID}
                            colorScheme="blue"
                          />
                        </>
                      )}
                      {showCopiedOrderID && (
                        <Box
                          as="span"
                          fontSize="sm"
                          color="green.500"
                          ml={2}
                          transition="opacity 0.5s ease-out"
                          opacity={showCopiedOrderID ? 1 : 0}
                        >
                          Disalin!
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  <Divider my={3} borderColor={separatorLine} />
                  {/* VA Number */}
                  <Flex justifyContent="space-between" mb={1} align="center">
                    <Text>VA Number:</Text>
                    <Flex align="center">
                      {!hideVANumber && (
                        <>
                          <Text fontWeight="medium">
                            {paymentInfo.vaNumber}
                          </Text>
                          <IconButton
                            aria-label="Salin VA Number"
                            icon={<CopyIcon />}
                            size="sm"
                            ml={2}
                            onClick={handleCopyVANumber}
                            colorScheme="blue"
                          />
                        </>
                      )}
                      {showCopiedVANumber && (
                        <Box
                          as="span"
                          fontSize="sm"
                          color="green.500"
                          ml={2}
                          transition="opacity 0.5s ease-out"
                          opacity={showCopiedVANumber ? 1 : 0}
                        >
                          Disalin!
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  <Divider my={3} borderColor={separatorLine} />
                  {/* Amount */}
                  <Flex justifyContent="space-between" mb={1} align="center">
                    <Text>Jumlah:</Text>
                    <Flex align="center">
                      {!hideAmount && (
                        <>
                          <Text fontWeight="medium">
                            Rp{paymentInfo.amount.toLocaleString('id-ID')}
                          </Text>
                          <IconButton
                            aria-label="Salin Jumlah"
                            icon={<CopyIcon />}
                            size="sm"
                            ml={2}
                            onClick={handleCopyAmount}
                            colorScheme="blue"
                          />
                        </>
                      )}
                      {showCopiedAmount && (
                        <Box
                          as="span"
                          fontSize="sm"
                          color="green.500"
                          ml={2}
                          transition="opacity 0.5s ease-out"
                          opacity={showCopiedAmount ? 1 : 0}
                        >
                          Disalin!
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  <Divider my={3} borderColor={separatorLine} />
                  {/* QR Code */}
                  <Box
                    flexShrink={0}
                    display="flex"
                    flexDirection="column" // Teks "Pindai" di bawah QR Code
                    alignItems="center" // Pusatkan QR Code dan teks di tengah
                    justifyContent="center"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    <QRCodeCanvas
                      value={paymentInfo.vaNumber} // Data untuk kode QR
                      size={qrCodeSize} // Ukuran QR Code responsif
                      bgColor="#ffffff" // Warna background
                      fgColor="#000000" // Warna depan
                      level="H" // Tingkat koreksi kesalahan (L, M, Q, H)
                      includeMargin={true} // Tambahkan margin
                    />
                    <Text
                      mt={2}
                      fontSize="sm"
                      color="gray.500"
                      textAlign="center"
                    >
                      Pindai kode ini untuk membayar melalui Virtual Account
                    </Text>
                  </Box>

                  {/* Print Button */}
                  <Button
                    onClick={handlePrint}
                    leftIcon={<DownloadIcon />}
                    colorScheme="green"
                    size="sm"
                    width="100%"
                    mt={4}
                    variant="outline"
                    borderColor="green.400" // Outline default
                    _hover={{
                      background: 'green.300', // Warna hijau saat hover
                      borderColor: 'transparent', // Hilangkan outline saat hover
                      boxShadow: 'md',
                      color: 'white',
                    }}
                    _active={{
                      background: 'green.400', // Warna lebih gelap saat klik
                      borderColor: 'transparent', // Hilangkan outline saat klik
                      boxShadow: 'inner',
                    }}
                    _focus={{
                      outline: 'none', // Hilangkan outline biru saat fokus
                      boxShadow: 'none',
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Cetak Informasi
                  </Button>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              rounded={20}
              colorScheme="blue"
              mr={5}
              onClick={closePaymentModal}
            >
              Kembali
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="lg" fontWeight="bold">
            Konfirmasi
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch" textAlign="center">
              <Text fontSize="md" color={textColor}>
                Apakah Anda yakin ingin kembali ke menu awal ? Harap simpan
                terlebih dahulu informasi virtual account Anda.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={handleNavigate}
              size="lg"
              width="200px"
              variant="solid"
              boxShadow="md"
              mr={4}
            >
              Ya
            </Button>
            <Button
              colorScheme="gray"
              onClick={onClose}
              size="lg"
              width="200px"
              variant="outline"
              boxShadow="md"
            >
              Tidak
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
