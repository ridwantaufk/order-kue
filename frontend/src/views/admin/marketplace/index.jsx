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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [unitPrice, setUnitPrice] = useState({});
  const [selectedTotalPrice, setSelectedTotalPrice] = useState({});
  const [totQuantity, setTotQuantity] = useState(0);
  const [totPrice, setTotPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [temporaryQuantity, setTemporaryQuantity] = useState({});
  const [temporaryUnitPrice, setTemporaryUnitPrice] = useState({});
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
  const [isLocationInvalid, setIsLocationInvalid] = useState(false);
  const [locationCoords, setLocationCoords] = useState({ lat: '', lng: '' });
  const [locationError, setLocationError] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const toastId = useRef(null);
  const deleteInputRef = useRef(deleteInput);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [terlaris, setTerlaris] = useState(false);
  const activeColor = useColorModeValue('blue.600', 'blue.300');

  console.log(
    'process.env.REACT_APP_BACKEND_URL : ',
    process.env.REACT_APP_BACKEND_URL,
  );

  // Fungsi untuk menangani klik pada kategori "Makanan"
  const handleCategoryClick = (category) => {
    if (terlaris) {
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
      setSearchKeyword(category);
    } else if (category === 'minuman') {
      setSearchKeyword(category);
    } else if (category === 'semua') {
      setSearchKeyword('');
    }
  };

  useEffect(() => {
    return () => {
      if (toastId.current) {
        toast.close(toastId.current);
        toastId.current = null;
      }
      setSelectedQuantity({});
      setSelectedTotalPrice({});
      setUnitPrice({});
    };
  }, []);

  useEffect(() => {
    deleteInputRef.current = deleteInput;
  }, [deleteInput]);
  // console.log(
  //   'process.env.REACT_APP_BACKEND_URL : ',
  //   process.env.REACT_APP_BACKEND_URL,
  // );
  useEffect(() => {
    const fetchProducts = async () => {
      console.log(
        'URL : ',
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
      );
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
      setTemporaryUnitPrice(unitPrice);
    }
  }, [selectedQuantity, selectedTotalPrice, unitPrice]);

  useEffect(() => {
    // console.log('quantity : ', totQuantity, 'totalprice : ', totPrice);

    if (totQuantity > 0) {
      if (toastId.current) {
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
                  color: '#a5a6f2',
                  fontSize: '12px',
                }}
              >
                Klik untuk melanjutkan.
              </div>
            </Box>
          ),
          status: 'info',
          duration: null,
          isClosable: true,
          position: 'bottom',
          variant: 'subtle',
          containerStyle: {
            width: '400px',
            height: 'auto',
            cursor: 'pointer',
          },
        });
      } else {
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
                  e.stopPropagation();
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
                  color: '#a5a6f2',
                  fontSize: '12px',
                }}
              >
                Klik untuk melanjutkan.
              </div>
            </Box>
          ),
          status: 'info',
          duration: null,
          isClosable: true,
          position: 'bottom',
          variant: 'subtle',
          onCloseComplete: () => {
            if (deleteInputRef.current) {
              setSelectedQuantity({});
              setSelectedTotalPrice({});
              setUnitPrice({});
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
      toast.close(toastId.current);
      toastId.current = null;
    }
  }, [totQuantity, totPrice]);

  const handleToastClick = () => {
    setPaymentDetails({
      itemQuantity: selectedQuantity,
      itemPrice: unitPrice,
      quantity: totQuantity,
      price: totPrice,
    });
    console.log('paymentDetails : ', paymentDetails);
    setTotQuantity(0);
    setTotPrice(0);
    setIsModalOpen(true);
    setDeleteInput(false);
  };

  const closeModal = () => {
    setDeleteInput(true);
    setIsModalOpen(false);
    console.log('temporaryQuantity : ', temporaryQuantity);
    setSelectedQuantity(temporaryQuantity);
    setSelectedTotalPrice(temporaryPrice);
    setUnitPrice(temporaryUnitPrice);
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

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedQuantity((prevData) => {
      const updatedData = { ...prevData };
      updatedData[id] = newQuantity;
      return updatedData;
    });
  };

  const handleTotalPriceChange = (id, newTotalPrice, unitPrice) => {
    setSelectedTotalPrice((prevData) => {
      const updatedData = { ...prevData };
      updatedData[id] = newTotalPrice;
      return updatedData;
    });

    setUnitPrice((prevData) => {
      const updatedData = { ...prevData };
      updatedData[id] = unitPrice;
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

  const handlePaymentMethod = async () => {
    try {
      // Reset error states
      setIsNameInvalid(false);
      setIsPhoneInvalid(false);
      setIsAddressInvalid(false);
      setIsEmailInvalid(false);
      setIsLocationInvalid(false);

      let hasError = false;

      // Validate customer name
      if (!customerName.trim()) {
        setIsNameInvalid(true);
        hasError = true;
      }

      // Validate phone number
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

      // Validate email (optional but must be valid if provided)
      const emailRegex = /^[\^\s@]+@[\^\s@]+\.[\^\s@]+$/;
      if (email && email.trim() && !emailRegex.test(email.trim())) {
        setIsEmailInvalid(true);
        toast({
          title: 'Format Email Salah',
          description: 'Masukkan email yang valid (contoh: nama@example.com)',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      // Validate location
      if (!selectedLocation) {
        setIsLocationInvalid(true);
        hasError = true;
        toast({
          title: 'Lokasi Belum Dipilih',
          description: 'Silakan ambil lokasi dari Maps terlebih dahulu.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      // Validate address
      if (!manualAddress.trim()) {
        setIsAddressInvalid(true);
        hasError = true;
        toast({
          title: 'Alamat Belum Diisi',
          description: 'Mohon masukkan alamat lengkap pengiriman.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      // Check if any validation errors
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

      // Validate payment details
      if (
        !paymentDetails ||
        !paymentDetails.price ||
        paymentDetails.price <= 0
      ) {
        toast({
          title: 'Data Pembayaran Tidak Valid',
          description: 'Pastikan ada item yang dipilih untuk dibeli.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      setDisabled(true);

      // Prepare request data
      const requestData = {
        customerInfo: {
          order_code: `ORDER-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000,
          )}`,
          name: customerName.trim(),
          phone: phoneNumber.trim(),
          address: manualAddress.trim(),
          location: selectedLocation
            ? {
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
              }
            : null,
          customer_email: email ? email.trim() : null,
        },
        paymentDetails: paymentDetails,
        orderMetadata: {
          orderDate: new Date(),
          deviceInfo: navigator.userAgent || null,
        },
      };

      console.log('Initiating payment with data:', requestData);

      // Call initiate payment endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/initiate`,
        requestData,
      );

      const { snapToken, orderId, redirectUrl } = response.data;

      if (!snapToken) {
        throw new Error('Failed to get payment token');
      }

      // Store order info for tracking
      const orderInfo = {
        orderId: orderId,
        orderCode: requestData.customerInfo.order_code,
        customerName: requestData.customerInfo.name,
        totalAmount: requestData.paymentDetails.price,
        timestamp: new Date().toISOString(),
      };

      const orderCodePrev = localStorage.getItem('order_code');
      const orderIdNow = orderId;

      if (orderCodePrev && orderCodePrev !== 'null' && orderCodePrev !== '') {
        localStorage.setItem('order_code', `${orderCodePrev},${orderIdNow}`);
      } else {
        localStorage.setItem('order_code', orderIdNow);
      }

      localStorage.setItem('currentOrder', JSON.stringify(orderInfo));

      console.log('requestData : ', requestData);

      // Open Midtrans payment popup
      window.snap.pay(snapToken, {
        onSuccess: async function (result) {
          console.log('Payment success:', result);

          // Clear disabled state
          setDisabled(false);

          // Tampilkan notifikasi sukses
          toast({
            title: 'Pembayaran Berhasil!',
            description: `Pesanan ${orderId} sedang diproses. Terima kasih!`,
            status: 'success',
            duration: 7000,
            isClosable: true,
            position: 'top-right',
          });

          // if (!requestData) {
          //   toast({
          //     title: 'Error',
          //     description: 'Data pesanan tidak ditemukan',
          //     status: 'error',
          //     duration: 3000,
          //     isClosable: true,
          //   });
          //   return;
          // }

          // try {
          //   // Kurangi stok berdasarkan produk di order
          //   await axios.put(
          //     `${process.env.REACT_APP_BACKEND_URL}/api/products/0`,
          //     {
          //       decreaseStock: true,
          //       items: Object.entries(
          //         requestData.paymentDetails.itemQuantity,
          //       ).map(([product_id, quantity]) => ({
          //         product_id: parseInt(product_id),
          //         quantity,
          //       })),
          //     },
          //   );

          //   console.log('Stok produk berhasil diperbarui.');
          // } catch (error) {
          //   console.error('Gagal update stok:', error);
          //   toast({
          //     title: 'Gagal Update Stok',
          //     description:
          //       'Stok tidak berhasil diperbarui. Silakan cek kembali.',
          //     status: 'error',
          //     duration: 5000,
          //     isClosable: true,
          //     position: 'top-right',
          //   });
          // }

          // Redirect ke halaman daftar order
          window.location.replace('/orderan');
        },

        onPending: function (result) {
          console.log('Payment pending:', result);

          setDisabled(false);

          // Prepare invoice data
          const invoiceInfo = {
            orderId: orderId,
            orderCode: requestData.customerInfo.order_code,
            customerName: requestData.customerInfo.name,
            customerPhone: requestData.customerInfo.phone,
            customerEmail: requestData.customerInfo.customer_email,
            customerAddress: requestData.customerInfo.address,
            customerLocation: requestData.customerInfo.location,
            totalAmount: requestData.paymentDetails.price,
            items: Object.entries(requestData.paymentDetails.itemQuantity).map(
              ([key, quantity]) => {
                const product = products.find(
                  (p) => p.product_id === Number(key),
                );
                const price = requestData.paymentDetails.itemPrice[key];
                return {
                  id: key,
                  name: product ? product.product_name : `Product ${key}`,
                  quantity: quantity,
                  price: price,
                  total: quantity * price,
                };
              },
            ),
            paymentMethod: result.payment_type || 'bank_transfer',
            vaNumber: result.va_numbers ? result.va_numbers[0].va_number : null,
            transactionId: result.transaction_id,
            transactionTime: new Date().toLocaleString('id-ID'),
            qrString: result.qr_string || null,
          };

          setInvoiceData(invoiceInfo);
          setShowInvoice(true);

          toast({
            title: 'Menunggu Pembayaran',
            description: `Pesanan ${orderId} menunggu pembayaran. Invoice telah disiapkan.`,
            status: 'warning',
            duration: 7000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: function (result) {
          console.log('Payment error:', result);

          setDisabled(false);

          toast({
            title: 'Pembayaran Gagal',
            description:
              'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },

        onClose: function () {
          console.log('Payment popup closed');

          setDisabled(false);

          toast({
            title: 'Pembayaran Dibatalkan',
            description: 'Anda dapat melanjutkan pembayaran kapan saja.',
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
      });
    } catch (error) {
      console.error('Payment initiation error:', error);

      setDisabled(false);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal memulai proses pembayaran';

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

  const handlePrintAndDownload = async () => {
    const printContent = document.getElementById('invoice-print-area');
    if (!printContent) {
      toast({
        title: 'Error',
        description: 'Invoice content not found.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const loadingToast = toast({
      title: 'Processing Invoice',
      description: 'Generating PDF and preparing for print...',
      status: 'info',
      duration: null,
      isClosable: false,
    });

    try {
      // 1. Generate and Download PDF
      // const canvas = await html2canvas(printContent, {
      //   scale: 2,
      //   useCORS: true,
      //   logging: false,
      // });
      // const imgData = canvas.toDataURL('image/png');
      // const pdf = new jsPDF({
      //   orientation: 'portrait',
      //   unit: 'mm',
      //   format: 'a4',
      // });
      // const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      // pdf.save(`invoice-${invoiceData?.orderId}.pdf`);

      // 2. Open Print Dialog
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
          <html>
          <head>
              <title>Invoice ${invoiceData?.orderId}</title>
              <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .invoice-header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total-row { font-weight: bold; background-color: #f9f9f9; }
              @media print { body { margin: 0; } }
              </style>
          </head>
          <body>
              ${printContent.innerHTML}
          </body>
          </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      toast.update(loadingToast, {
        title: 'Success',
        description: 'PDF downloaded and print dialog opened.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during print/download:', error);
      toast.update(loadingToast, {
        title: 'Error',
        description: 'Could not process the invoice.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
        <Flex direction={['column', 'row']} gap="20px">
          <Box flex="2">
            <Skeleton
              height="300px"
              width="100%"
              baseColor={skeletonBgColor}
              highlightColor={skeletonColor}
            />

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

          <Box flex="1">
            <Skeleton
              height="calc(85vh - 100px)"
              width="100%"
              baseColor={skeletonBgColor}
              highlightColor={skeletonColor}
            />
          </Box>
        </Flex>

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
            overflowY="auto"
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

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        size="xl"
        isCentered
        isLazy
      >
        <ModalOverlay backdropFilter="blur(8px)" />
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
                    onSave={(pos) => {
                      setSelectedLocation(pos);
                      setIsLocationInvalid(false);
                    }}
                  />
                </FormControl>

                <FormControl isRequired isInvalid={isAddressInvalid} mb={4}>
                  <FormLabel color={nameTextColor}>
                    Alamat Lengkap / Detail / Patokan
                  </FormLabel>
                  <Textarea
                    placeholder="Masukkan alamat lengkap pengiriman"
                    focusBorderColor="blue.400"
                    value={manualAddress}
                    onChange={(e) => {
                      setManualAddress(e.target.value);
                      setIsAddressInvalid(false); // reset error saat ngetik ulang
                    }}
                    disabled={disabled}
                    background={
                      disabled
                        ? nameBackgroundColorDisabled
                        : nameBackgroundColor
                    }
                    textColor={disabled ? nameTextColorDisabled : nameTextColor}
                  />
                  {isAddressInvalid && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      Alamat lengkap harus diisi.
                    </Text>
                  )}
                </FormControl>

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
                      const value = e.target.value.replace(/[^0-9+]/g, '');
                      if (value.length <= 12) {
                        setPhoneNumber(value);
                        setIsPhoneInvalid(false);
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

                <FormControl isInvalid={isEmailInvalid} mb={4}>
                  <FormLabel color={nameTextColor}>Email</FormLabel>
                  <Input
                    placeholder="example@mail.com"
                    focusBorderColor="blue.400"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      setEmail(value);
                      setIsEmailInvalid(false);
                    }}
                    onFocus={() => setIsEmailInvalid(false)}
                    disabled={disabled}
                    background={
                      disabled
                        ? nameBackgroundColorDisabled
                        : nameBackgroundColor
                    }
                    textColor={disabled ? nameTextColorDisabled : nameTextColor}
                  />
                  {isEmailInvalid && (
                    <Text color="red.500" fontSize="sm">
                      Email harus diisi dengan format yang benar.
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Contoh: nama@example.com
                  </Text>
                </FormControl>
              </Box>

              {!disabled && (
                <ButtonGroup
                  spacing={4}
                  width="100%"
                  direction={{ base: 'column', sm: 'row' }}
                >
                  <Button
                    onClick={handlePaymentMethod}
                    colorScheme="blue"
                    width="100%"
                    size={{ base: 'md', sm: 'lg' }}
                    fontSize={{ base: 'sm', sm: 'md' }}
                    boxShadow="md"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    Pilih Metode Pembayaran
                  </Button>
                </ButtonGroup>
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

      <Modal
        isOpen={showInvoice}
        onClose={() => {
          setShowInvoice(false);
          window.location.replace('/orderan');
        }}
        size="xl"
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent
          maxWidth={{ base: '95%', md: '768px', lg: '900px' }}
          maxHeight="90vh"
          overflowY="auto"
        >
          <ModalHeader textAlign="center" color={nameTextColor}>
            <VStack spacing={2}>
              <Heading size="lg">Invoice Pembayaran</Heading>
              <Text fontSize="sm" color="gray.500">
                Simpan atau cetak invoice ini sebagai bukti pemesanan
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <div id="invoice-print-area">
              {invoiceData && (
                <VStack spacing={6} align="stretch">
                  {/* Header Invoice */}
                  <Box
                    textAlign="center"
                    pb={4}
                    borderBottom="2px solid"
                    borderColor={separatorLine}
                  >
                    <Heading size="md" color={nameTextColor}>
                      INVOICE PEMESANAN
                    </Heading>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Tanggal: {invoiceData.transactionTime}
                    </Text>
                  </Box>

                  {/* Customer Info */}
                  <Box
                    p={4}
                    bg={backgroundColor}
                    borderRadius="lg"
                    borderWidth="1px"
                  >
                    <Heading size="sm" mb={3} color={nameTextColor}>
                      Informasi Pemesan
                    </Heading>
                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                      gap={4}
                    >
                      <VStack align="start" spacing={2}>
                        <Text>
                          <strong>Nama:</strong> {invoiceData.customerName}
                        </Text>
                        <Text>
                          <strong>No. HP:</strong> {invoiceData.customerPhone}
                        </Text>
                        {invoiceData.customerEmail && (
                          <Text>
                            <strong>Email:</strong> {invoiceData.customerEmail}
                          </Text>
                        )}
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text>
                          <strong>Order ID:</strong> {invoiceData.orderId}
                        </Text>
                        <Text>
                          <strong>Kode Pesanan:</strong> {invoiceData.orderCode}
                        </Text>
                        <Text>
                          <strong>Status:</strong> Menunggu Pembayaran
                        </Text>
                      </VStack>
                    </Grid>
                    <Box mt={3}>
                      <Text>
                        <strong>Alamat:</strong>
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        {invoiceData.customerAddress}
                      </Text>
                    </Box>
                  </Box>

                  {/* Order Items */}
                  <Box
                    p={4}
                    bg={backgroundColor}
                    borderRadius="lg"
                    borderWidth="1px"
                  >
                    <Heading size="sm" mb={3} color={nameTextColor}>
                      Rincian Pesanan
                    </Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Item</Th>
                          <Th isNumeric>Qty</Th>
                          <Th isNumeric>Harga</Th>
                          <Th isNumeric>Total</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {invoiceData.items.map((item, index) => (
                          <Tr key={index}>
                            <Td fontSize="sm">{item.name}</Td>
                            <Td isNumeric fontSize="sm">
                              {item.quantity}
                            </Td>
                            <Td isNumeric fontSize="sm">
                              Rp {item.price.toLocaleString('id-ID')}
                            </Td>
                            <Td isNumeric fontSize="sm">
                              Rp {item.total.toLocaleString('id-ID')}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                      <Tfoot>
                        <Tr borderTop="2px solid" borderColor={separatorLine}>
                          <Th colSpan={3} textAlign="right">
                            Total Pembayaran:
                          </Th>
                          <Th isNumeric fontSize="md" color="blue.600">
                            Rp {invoiceData.totalAmount.toLocaleString('id-ID')}
                          </Th>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </Box>

                  {/* Payment Info */}
                  <Box
                    p={4}
                    bg={backgroundColor}
                    borderRadius="lg"
                    borderWidth="1px"
                  >
                    <Heading size="sm" mb={3} color={nameTextColor}>
                      Informasi Pembayaran
                    </Heading>
                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                      gap={4}
                    >
                      <VStack align="start" spacing={3}>
                        <Text>
                          <strong>Metode Pembayaran:</strong>{' '}
                          {invoiceData.paymentMethod.toUpperCase()}
                        </Text>
                        {invoiceData.vaNumber && (
                          <Flex align="center" wrap="wrap">
                            <Text mr={2}>
                              <strong>VA Number:</strong> {invoiceData.vaNumber}
                            </Text>
                            <IconButton
                              aria-label="Copy VA Number"
                              icon={<CopyIcon />}
                              size="xs"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  invoiceData.vaNumber,
                                );
                                toast({
                                  title: 'VA Number disalin!',
                                  status: 'success',
                                  duration: 2000,
                                  isClosable: true,
                                });
                              }}
                            />
                          </Flex>
                        )}
                        <Text>
                          <strong>Transaction ID:</strong>{' '}
                          {invoiceData.transactionId}
                        </Text>
                      </VStack>

                      {(invoiceData.qrString || invoiceData.vaNumber) && (
                        <VStack align="center" spacing={2}>
                          <QRCodeCanvas
                            value={invoiceData.qrString || invoiceData.vaNumber}
                            size={150}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                          />
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            textAlign="center"
                          >
                            Scan untuk pembayaran cepat
                          </Text>
                        </VStack>
                      )}
                    </Grid>
                  </Box>

                  {/* Instructions */}
                  <Box
                    p={4}
                    bg="yellow.50"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="yellow.200"
                  >
                    <Heading size="sm" mb={2} color="yellow.800">
                      Petunjuk Pembayaran
                    </Heading>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="yellow.700">
                        1. Lakukan pembayaran sesuai nominal yang tertera
                      </Text>
                      <Text fontSize="sm" color="yellow.700">
                        2. Gunakan VA Number atau scan QR Code untuk pembayaran
                      </Text>
                      <Text fontSize="sm" color="yellow.700">
                        3. Simpan invoice ini sebagai bukti pemesanan
                      </Text>
                      <Text fontSize="sm" color="yellow.700">
                        4. Pesanan akan diproses setelah pembayaran dikonfirmasi
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              )}
            </div>
          </ModalBody>

          <ModalFooter justifyContent="space-between" flexWrap="wrap" gap={2}>
            <ButtonGroup spacing={2} width={{ base: '100%', sm: 'auto' }}>
              <Button
                onClick={handlePrintAndDownload}
                leftIcon={<DownloadIcon />}
                colorScheme="green"
                size="sm"
                flex={{ base: '1', sm: 'none' }}
              >
                Print & Download Invoice
              </Button>

              <Button
                onClick={() => {
                  // Copy invoice text
                  const invoiceText = `
                  INVOICE PEMBAYARAN
                  Tanggal: ${invoiceData?.transactionTime}

                  INFORMASI PEMESAN:
                  Nama: ${invoiceData?.customerName}
                  No. HP: ${invoiceData?.customerPhone}
                  ${
                    invoiceData?.customerEmail
                      ? `Email: ${invoiceData.customerEmail}`
                      : ''
                  }
                  Order ID: ${invoiceData?.orderId}
                  Kode Pesanan: ${invoiceData?.orderCode}
                  Alamat: ${invoiceData?.customerAddress}

                  RINCIAN PESANAN:
                  ${invoiceData?.items
                    .map(
                      (item) =>
                        `${item.name} - ${
                          item.quantity
                        }x Rp ${item.price.toLocaleString(
                          'id-ID',
                        )} = Rp ${item.total.toLocaleString('id-ID')}`,
                    )
                    .join('\n')}

                  TOTAL PEMBAYARAN: Rp ${invoiceData?.totalAmount.toLocaleString(
                    'id-ID',
                  )}

                  INFORMASI PEMBAYARAN:
                  Metode: ${invoiceData?.paymentMethod.toUpperCase()}
                  ${
                    invoiceData?.vaNumber
                      ? `VA Number: ${invoiceData.vaNumber}`
                      : ''
                  }
                  Transaction ID: ${invoiceData?.transactionId}
                  `;

                  navigator.clipboard.writeText(invoiceText);
                  toast({
                    title: 'Invoice disalin ke clipboard!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }}
                leftIcon={<CopyIcon />}
                colorScheme="blue"
                variant="outline"
                size="sm"
                flex={{ base: '1', sm: 'none' }}
              >
                Copy Invoice
              </Button>
            </ButtonGroup>

            <Button
              onClick={() => {
                setShowInvoice(false);
                window.location.replace('/orderan');
              }}
              colorScheme="gray"
              size="sm"
              width={{ base: '100%', sm: 'auto' }}
              mt={{ base: 2, sm: 0 }}
            >
              Tutup & Lanjutkan
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

            <SimpleGrid columns={{ base: 2, md: 3 }} gap="20px">
              {products.map((product) => {
                const productName = product.product_name.toLowerCase();

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
