import React from 'react';
import { Box, CloseButton } from '@chakra-ui/react';

const OrderToast = ({ totQuantity, totPrice, onClick, onClose }) => (
  <Box
    style={{
      position: 'relative',
      cursor: 'pointer',
      padding: '10px',
      backgroundColor: '#6831f5',
      borderRadius: '8px',
      border: '1px solid #6831f5',
    }}
    onClick={onClick}
  >
    <CloseButton
      position="absolute"
      top="8px"
      right="8px"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
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
    <div style={{ marginTop: '10px', color: '#a5a6f2', fontSize: '12px' }}>
      Klik untuk melanjutkan.
    </div>
  </Box>
);

export default OrderToast;
