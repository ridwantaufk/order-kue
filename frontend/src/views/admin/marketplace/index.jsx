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
  Textarea,
} from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';
import Antrian from 'views/admin/marketplace/components/Antrian';
import Item from 'components/card/Item';
import Card from 'components/card/Card.js';
import Tracker from '../../../components/Tracker';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LocationPicker from 'components/location/maps';

import axios from 'axios';
import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';

import { openPrintWindow } from './print/print';
import { QRCodeCanvas } from 'qrcode.react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

export default function Marketplace() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const modalBodyRef = useRef(null);
  const paymentModalBodyRef = useRef(null);

  const skeletonBgColor = useColorModeValue('#c2c2c2', '#240d4f');
  const skeletonColor = useColorModeValue('#f0f0f0', '#555');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.400', 'white');
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

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: '', lng: '' });
  const [locationError, setLocationError] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone);
  };

  // Ambil lokasi dari device
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung di perangkat ini.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        });
        setLocationError('');
      },
      (error) => {
        setLocationError(
          'Gagal mengambil lokasi. Pastikan izin lokasi diaktifkan.',
        );
        console.error(error);
      },
    );
  };

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

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [terlaris, setTerlaris] = useState(false);
  const activeColor = useColorModeValue('blue.600', 'blue.300');

  // Fungsi untuk menangani klik pada kategori "Makanan"
  const handleCategoryClick = (category) => {
    if (terlaris) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/products`,
            // {
            //   headers: {
            //     'ngrok-skip-browser-warning': 'true',
            //   },
            // },
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
    }
    setActiveCategory(category);
    if (category === 'makanan') {
      setSearchKeyword('brownies'); // Set kata kunci pencarian menjadi 'brownies' ketika klik kategori Makanan
    } else if (category === 'minuman') {
      setSearchKeyword('minuman'); // Kosongkan kata kunci pencarian untuk "Minuman"
    } else if (category === 'semua') {
      setSearchKeyword(''); // Kosongkan kata kunci untuk "Semua Menu" agar semua produk tampil
    }
  };

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
      console.log(
        'URL : ',
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
      );
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`,
          // {
          //   headers: {
          //     'ngrok-skip-browser-warning': 'true',
          //   },
          // },
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
      // Reset semua error state
      setIsNameInvalid(false);
      setIsPhoneInvalid(false);
      setIsAddressInvalid(false);

      let hasError = false;

      // Validasi nama
      if (!customerName.trim()) {
        setIsNameInvalid(true);
        hasError = true;
      }

      // Validasi nomor telepon
      if (!phoneNumber.trim()) {
        setIsPhoneInvalid(true);
        hasError = true;
      } else if (!validatePhoneNumber(phoneNumber.trim())) {
        setIsPhoneInvalid(true);
        hasError = true;
        toast({
          title: 'Format Nomor HP Salah',
          description:
            'Gunakan format nomor HP Indonesia yang valid (08xxxxxxxxxx)',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      // Validasi alamat
      if (!manualAddress.trim()) {
        setIsAddressInvalid(true);
        hasError = true;
      }

      // Jika ada error, tampilkan toast umum
      if (hasError) {
        toast({
          title: 'Form Tidak Lengkap',
          description: 'Harap lengkapi semua data yang diperlukan.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      setDisabled(true);

      // Format data sesuai dengan yang diharapkan backend
      const requestData = {
        customerInfo: {
          name: customerName.trim(),
          phone: phoneNumber.trim(),
          address: manualAddress.trim(),
          location: selectedLocation
            ? {
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
              }
            : null,
        },
        paymentDetails: paymentDetails,
        orderMetadata: {
          orderDate: new Date(),
          deviceInfo: navigator.userAgent || null,
        },
      };

      console.log('Sending payment data:', requestData);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/create`,
        requestData,
      );
      // console.log('Payment response:', response.data.data);

      setPaymentInfo(response.data.data);
      const orderCodePrev = localStorage.getItem('order_code');
      const orderIdNow = response.data.data.orderID;

      if (orderCodePrev && orderCodePrev !== 'null' && orderCodePrev !== '') {
        localStorage.setItem('order_code', `${orderCodePrev},${orderIdNow}`);
      } else {
        localStorage.setItem('order_code', orderIdNow);
      }

      toast({
        title: 'Pembayaran Berhasil Dibuat',
        description:
          'Virtual Account telah dibuat. Silakan lakukan pembayaran.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Payment error:', error);
      setDisabled(false);

      // Handle error response
      const errorMessage =
        error?.response?.data?.message || 'Gagal membuat Virtual Account';
      toast({
        title: 'Error Pembayaran',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handlePaymentDANA = () => {};

  const payment = () => {
    console.log('test : ');
  };

  if (loading) {
    return (
      <Box
        padding="20px"
        display="flex"
        flexDirection="column"
        gap="20px"
        marginTop="80px"
      >
        {/* Layout dengan dua kolom */}
        <Flex direction={['column', 'row']} gap="20px">
          {/* Kolom kiri */}
          <Box flex="2">
            {/* Skeleton untuk header */}
            <Skeleton
              height="300px"
              width="100%"
              baseColor={skeletonBgColor}
              highlightColor={skeletonColor}
            />

            {/* Skeleton untuk menu */}
            <Flex direction={['column', 'row']} gap="15px" marginTop="20px">
              <Skeleton
                height="calc(40vh - 100px)"
                width="15vw"
                baseColor={skeletonBgColor}
                highlightColor={skeletonColor}
              />
              <Skeleton
                height="calc(40vh - 100px"
                width="15vw"
                baseColor={skeletonBgColor}
                highlightColor={skeletonColor}
              />
              <Skeleton
                height="calc(40vh - 100px"
                width="15vw"
                baseColor={skeletonBgColor}
                highlightColor={skeletonColor}
              />
            </Flex>
          </Box>

          {/* Kolom kanan */}
          <Box flex="1">
            {/* Skeleton untuk konten kanan */}
            <Skeleton
              height="calc(85vh - 100px)"
              width="100%"
              baseColor={skeletonBgColor}
              highlightColor={skeletonColor}
            />
          </Box>
        </Flex>

        {/* Skeleton untuk tabel */}
        <Box marginTop="20px">
          <Skeleton
            height="40px"
            width="100%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
          <Skeleton
            height="40px"
            width="100%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
          <Skeleton
            height="40px"
            width="100%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
        </Box>

        {/* Skeleton untuk tombol */}
        <Box marginTop="20px">
          <Skeleton
            height="50px"
            width="30%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      <Tracker page="/orderan" />
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent
          maxWidth={{ base: '98%', md: '768px', lg: '1000px' }}
          height="85vh"
          overflow="auto"
        >
          <ModalHeader>Detail Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            ref={modalBodyRef}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            overflowY="auto" // Mengaktifkan scroll vertikal jika konten melebihi tinggi
            height="calc(85vh - 100px)"
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
          maxHeight="85vh"
          overflowY="auto"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ModalHeader color={nameTextColor}>Proses Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            ref={paymentModalBodyRef}
            maxHeight="70vh"
            overflowY="auto"
            onWheel={(e) => {
              if (!isMobileDevice) {
                e.stopPropagation();
              }
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
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

                {/* Nama Pemesan */}
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
                    onChange={(e) => {
                      if (e.target.value.length <= 30) {
                        setCustomerName(e.target.value);
                      }
                    }}
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

                {/* Lokasi Otomatis */}
                <FormControl mb={4}>
                  <FormLabel color={nameTextColor}>Lokasi (otomatis)</FormLabel>
                  <Button onClick={() => setIsMapOpen(true)}>
                    Ambil Lokasi dari Maps
                  </Button>

                  {selectedLocation && (
                    <Box
                      mt={3}
                      h="200px"
                      w="100%"
                      borderRadius="md"
                      overflow="hidden"
                      borderWidth="1px"
                    >
                      <MapContainer
                        center={[selectedLocation.lat, selectedLocation.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        dragging={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        zoomControl={false}
                        attributionControl={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
                        />
                      </MapContainer>
                    </Box>
                  )}

                  <LocationPicker
                    isOpen={isMapOpen}
                    onClose={() => setIsMapOpen(false)}
                    onSave={(pos) => setSelectedLocation(pos)}
                  />
                </FormControl>

                {/* Alamat Manual */}
                <FormControl isRequired mb={4}>
                  <FormLabel color={nameTextColor}>
                    Alamat Lengkap / Detail / Patokan
                  </FormLabel>
                  <Textarea
                    placeholder="Masukkan alamat lengkap pengiriman"
                    focusBorderColor="blue.400"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    disabled={disabled}
                    background={
                      disabled
                        ? nameBackgroundColorDisabled
                        : nameBackgroundColor
                    }
                    textColor={disabled ? nameTextColorDisabled : nameTextColor}
                  />
                </FormControl>

                {/* Nomor WA / HP */}
                <FormControl isRequired isInvalid={isPhoneInvalid} mb={4}>
                  <FormLabel color={nameTextColor}>
                    Nomor HP / WhatsApp
                  </FormLabel>
                  <Input
                    placeholder="08xxxxxxxxxx"
                    focusBorderColor="blue.400"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      // Hanya allow angka dan beberapa karakter khusus
                      const value = e.target.value.replace(/[^0-9+]/g, '');
                      if (value.length <= 12) {
                        // Batasi panjang nomor
                        setPhoneNumber(value);
                        setIsPhoneInvalid(false); // Reset error saat user mengetik
                      }
                    }}
                    onFocus={() => setIsPhoneInvalid(false)}
                    disabled={disabled}
                    background={
                      disabled
                        ? nameBackgroundColorDisabled
                        : nameBackgroundColor
                    }
                    textColor={disabled ? nameTextColorDisabled : nameTextColor}
                  />
                  {isPhoneInvalid && (
                    <Text color="red.500" fontSize="sm">
                      Nomor HP harus diisi dengan format yang benar.
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Contoh: 08123456789 atau +6281234567890
                  </Text>
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
        gridTemplateColumns={
          isAuthenticated()
            ? {
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(3, 1fr)',
                '2xl': '1fr 0.46fr',
              }
            : {
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(3, 1fr)',
                '2xl': '1fr 0.46fr',
              }
        }
        gap={{ base: '20px', xl: '20px', '2xl': '50px' }}
        display={
          isAuthenticated()
            ? { base: 'block', lg: 'grid' }
            : { base: 'block', lg: 'grid' }
        }
      >
        <Flex
          flexDirection="column"
          gridArea={
            isAuthenticated()
              ? {
                  lg: '1 / 1 / 2 / 3',
                  xl: '1 / 1 / 2 / 3',
                  '2xl': '1 / 1 / 2 / 2',
                }
              : {
                  lg: '1 / 1 / 2 / 3',
                  xl: '1 / 1 / 2 / 3',
                  '2xl': '1 / 1 / 2 / 2',
                }
          }
        >
          <Banner
            setProducts={setProducts}
            setSelectedQuantity={setSelectedQuantity}
            setSelectedTotalPrice={setSelectedTotalPrice}
            setActiveCategory={setActiveCategory}
            setSearchKeyword={setSearchKeyword}
            setTerlaris={setTerlaris}
          />
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
                  color={
                    activeCategory === 'semua' ? activeColor : textColorBrand
                  }
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#art"
                  onClick={() => handleCategoryClick('semua')}
                  textShadow={
                    activeCategory === 'semua'
                      ? '1px 1px 3px rgba(52, 164, 235, 0.9)'
                      : 'none'
                  } // Efek shadow pada teks
                >
                  Semua Menu
                </Link>
                <Link
                  color={
                    activeCategory === 'makanan' ? activeColor : textColorBrand
                  }
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#art"
                  onClick={() => handleCategoryClick('makanan')}
                  textShadow={
                    activeCategory === 'makanan'
                      ? '1px 1px 3px rgba(52, 164, 235, 0.9)'
                      : 'none'
                  }
                >
                  Makanan
                </Link>
                <Link
                  color={
                    activeCategory === 'minuman' ? activeColor : textColorBrand
                  }
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#music"
                  onClick={() => handleCategoryClick('minuman')}
                  textShadow={
                    activeCategory === 'minuman'
                      ? '1px 1px 3px rgba(52, 164, 235, 0.9)'
                      : 'none'
                  }
                >
                  Minuman
                </Link>
              </Flex>
            </Flex>

            <SimpleGrid
              columns={{ base: 2, md: 3 }} // 2 columns on mobile (base), 3 on medium screens and above
              gap="20px" // Space between items
            >
              {products.map((product) => {
                const productName = product.product_name.toLowerCase();

                // Logika untuk menyembunyikan produk
                const isHidden =
                  searchKeyword &&
                  product.category.toLowerCase() !==
                    searchKeyword.toLowerCase();

                return (
                  <Item
                    key={product.product_id}
                    id={product.product_id}
                    name={product.product_name}
                    price={`${formatCurrency(product.price)}`}
                    description={product.description}
                    stock={product.stock}
                    image={
                      product.icon
                        ? `/assets/img/products/${product.icon}`
                        : '/assets/img/products/no-image.png'
                    }
                    onQuantityChange={handleQuantityChange}
                    onTotalPriceChange={handleTotalPriceChange}
                    selectedQuantity={selectedQuantity}
                    hidden={isHidden}
                  />
                );
              })}
            </SimpleGrid>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        >
          <Card
            px="0"
            mt={
              isAuthenticated()
                ? { base: '20px', lg: '0px' }
                : { base: '20px', lg: '0' }
            }
            position={
              isAuthenticated()
                ? { base: 'static', sm: 'static', md: 'static', lg: 'fixed' }
                : { base: 'static', sm: 'static', md: 'static', lg: 'fixed' }
            }
            top="110px"
            right={isAuthenticated() ? { lg: '20px' } : { lg: '20px' }}
            width={isAuthenticated() ? { lg: '32%', xl: '25%' } : { lg: '32%' }}
            boxShadow="md"
          >
            <Antrian />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
