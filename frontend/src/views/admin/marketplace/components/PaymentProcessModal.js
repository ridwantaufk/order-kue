import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Divider,
  useColorModeValue,
  useClipboard,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import { QRCodeCanvas } from 'qrcode.react';
import LocationPicker from 'components/location/maps';
import axios from 'axios';
import { openPrintWindow } from '../print/print';

const PaymentProcessModal = ({ isOpen, onClose, payment }) => {
  const [customerName, setCustomerName] = useState('');
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationCoords, setLocationCoords] = useState({ lat: '', lng: '' });
  const [manualAddress, setManualAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Color mode values
  const nameTextColor = useColorModeValue('navy.700', '#ccc');
  const nameTextColorDisabled = useColorModeValue('navy.700', 'gray.200');
  const nameBackgroundColor = useColorModeValue('white', 'gray.700');
  const nameBackgroundColorDisabled = useColorModeValue('#cccc', 'gray.600');
  const backgroundColor = useColorModeValue('gray.50', 'gray.700');
  const separatorLine = useColorModeValue('gray.300', '#ccc');
  const qrCodeSize = useBreakpointValue({ base: 150, md: 250, lg: 300 });

  // Toast
  const toast = useToast();

  // Clipboard hooks
  const { onCopy: onCopyOrderID } = useClipboard(paymentInfo?.orderID);
  const { onCopy: onCopyVANumber } = useClipboard(paymentInfo?.vaNumber);
  const { onCopy: onCopyAmount } = useClipboard(
    paymentInfo?.amount.toLocaleString('id-ID'),
  );

  // Copy states
  const [showCopiedOrderID, setShowCopiedOrderID] = useState(false);
  const [showCopiedVANumber, setShowCopiedVANumber] = useState(false);
  const [showCopiedAmount, setShowCopiedAmount] = useState(false);
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
        {
          customerName: customerName,
          paymentDetails: payment.paymentDetails,
        },
      );

      setPaymentInfo(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Gagal membuat Virtual Account');
    }
  };

  const handlePaymentDANA = () => {
    // Implementation for DANA payment
  };

  const handlePrint = () => {
    openPrintWindow(paymentInfo);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered isLazy>
      <ModalOverlay backdropFilter="blur(1.5px)" />
      <ModalContent
        maxWidth={{ base: '98%', md: '768px', lg: '1000px' }}
        height="85vh"
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
                    Pilih metode pembayaran yang Anda inginkan untuk melanjutkan
                    transaksi
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
                {disabled ? 'Informasi Pemesan' : 'Masukkan Informasi Pemesan'}
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
                    disabled ? nameBackgroundColorDisabled : nameBackgroundColor
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
                  <Text mt={2} fontSize="sm" color="green.600">
                    Lokasi terpilih: {selectedLocation.lat.toFixed(5)},{' '}
                    {selectedLocation.lng.toFixed(5)}
                  </Text>
                )}

                <LocationPicker
                  isOpen={isMapOpen}
                  onClose={() => setIsMapOpen(false)}
                  onSave={(pos) => setSelectedLocation(pos)}
                />
              </FormControl>

              {/* Alamat Manual */}
              <FormControl isRequired mb={4}>
                <FormLabel color={nameTextColor}>Alamat Lengkap</FormLabel>
                <Textarea
                  placeholder="Masukkan alamat lengkap pengiriman"
                  focusBorderColor="blue.400"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  disabled={disabled}
                  background={
                    disabled ? nameBackgroundColorDisabled : nameBackgroundColor
                  }
                  textColor={disabled ? nameTextColorDisabled : nameTextColor}
                />
              </FormControl>

              {/* Nomor WA / HP */}
              <FormControl isRequired mb={4}>
                <FormLabel color={nameTextColor}>Nomor HP / WhatsApp</FormLabel>
                <Input
                  placeholder="08xxxxxxxxxx"
                  focusBorderColor="blue.400"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={disabled}
                  background={
                    disabled ? nameBackgroundColorDisabled : nameBackgroundColor
                  }
                  textColor={disabled ? nameTextColorDisabled : nameTextColor}
                />
              </FormControl>
            </Box>

            <a
              href={`https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text fontSize="sm" color="blue.500" mt={1} textDecor="underline">
                Lihat di Google Maps
              </Text>
            </a>

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
                  size={{ base: 'md', sm: 'lg' }}
                  fontSize={{ base: 'sm', sm: 'md' }}
                  boxShadow="md"
                  whiteSpace="normal"
                  wordBreak="break-word"
                >
                  Bayar dengan Bank BCA
                </Button>
                <Button
                  onClick={handlePaymentDANA}
                  colorScheme="orange"
                  width="100%"
                  size={{ base: 'md', sm: 'lg' }}
                  fontSize={{ base: 'sm', sm: 'md' }}
                  boxShadow="md"
                  whiteSpace="normal"
                  wordBreak="break-word"
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
                        <Text fontWeight="medium">{paymentInfo.vaNumber}</Text>
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
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  width={{ base: '100%', md: 'auto' }}
                >
                  <QRCodeCanvas
                    value={paymentInfo.vaNumber}
                    size={qrCodeSize}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
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
                  borderColor="green.400"
                  _hover={{
                    background: 'green.300',
                    borderColor: 'transparent',
                    boxShadow: 'md',
                    color: 'white',
                  }}
                  _active={{
                    background: 'green.400',
                    borderColor: 'transparent',
                    boxShadow: 'inner',
                  }}
                  _focus={{
                    outline: 'none',
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
          <Button rounded={20} colorScheme="blue" mr={5} onClick={onClose}>
            Kembali
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentProcessModal;
