import { useState } from 'react';
import { useToast, useDisclosure, useClipboard } from '@chakra-ui/react';
import axios from 'axios';

export const usePayment = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Location states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: '', lng: '' });
  const [locationError, setLocationError] = useState('');

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Clipboard hooks
  const { onCopy: onCopyOrderID } = useClipboard(paymentInfo?.orderID);
  const { onCopy: onCopyVANumber } = useClipboard(paymentInfo?.vaNumber);
  const { onCopy: onCopyAmount } = useClipboard(
    paymentInfo?.amount.toLocaleString('id-ID'),
  );

  // Copy states
  const [copyStates, setCopyStates] = useState({
    orderID: { show: false, hide: false },
    vaNumber: { show: false, hide: false },
    amount: { show: false, hide: false },
  });

  const handleCopy = (type, copyFn) => {
    copyFn();
    setCopyStates((prev) => ({
      ...prev,
      [type]: { show: true, hide: true },
    }));

    setTimeout(() => {
      setCopyStates((prev) => ({
        ...prev,
        [type]: { show: false, hide: false },
      }));
    }, 700);
  };

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

  const handlePaymentBCA = async () => {
    try {
      if (!customerName.trim()) {
        setIsNameInvalid(true);
        toast({
          title: 'Nama Pemesan Kosong',
          description: 'Harap isi nama pemesan sebelum melanjutkan pembayaran.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      setDisabled(true);
      setIsNameInvalid(false);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/create`,
        { customerName, paymentDetails },
      );

      setPaymentInfo(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Gagal membuat Virtual Account');
    }
  };

  return {
    paymentDetails,
    paymentInfo,
    customerName,
    isNameInvalid,
    disabled,
    isModalOpen,
    isPaymentModalOpen,
    manualAddress,
    phoneNumber,
    isMapOpen,
    selectedLocation,
    locationCoords,
    locationError,
    copyStates,
    isOpen,
    onOpen,
    onClose,
    setPaymentDetails,
    setPaymentInfo,
    setCustomerName,
    setIsNameInvalid,
    setDisabled,
    setIsModalOpen,
    setIsPaymentModalOpen,
    setManualAddress,
    setPhoneNumber,
    setIsMapOpen,
    setSelectedLocation,
    setLocationCoords,
    setLocationError,
    getLocation,
    handlePaymentBCA,
    handleCopy: {
      orderID: () => handleCopy('orderID', onCopyOrderID),
      vaNumber: () => handleCopy('vaNumber', onCopyVANumber),
      amount: () => handleCopy('amount', onCopyAmount),
    },
  };
};
