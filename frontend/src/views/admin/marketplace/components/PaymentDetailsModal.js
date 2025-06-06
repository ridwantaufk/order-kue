import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  useColorModeValue,
} from '@chakra-ui/react';

const PaymentDetailsModal = ({
  isOpen,
  onClose,
  paymentDetails,
  products,
  onProcessPayment,
}) => {
  const separatorLine = useColorModeValue('gray.300', '#ccc');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        maxWidth={{ base: '98%', md: '768px', lg: '1000px' }}
        height="85vh"
        overflow="auto"
      >
        <ModalHeader>Detail Pembayaran</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" height="calc(85vh - 100px)">
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
                        (value * paymentDetails.itemPrice[key])?.toLocaleString(
                          'id-ID',
                        ) || '0';

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
          <Button rounded={20} colorScheme="blue" mr={5} onClick={onClose}>
            Kembali
          </Button>
          <Button onClick={onProcessPayment} variant="ghost">
            Proses Pembayaran
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentDetailsModal;
