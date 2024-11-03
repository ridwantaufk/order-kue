import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Card from 'components/card/Card';
import MainMenu from 'components/menu/MainMenu';
import CreateProduct from './createProduct';
import ViewProduct from './viewProduct';
import UpdateProduct from './updateProduct';

export default function Products({ onExpand, isExpanded }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [activeView, setActiveView] = useState('view');
  const [productToEdit, setProductToEdit] = useState(null);

  const handleMenuClick = (view) => {
    if (view === 'expand') {
      onExpand();
    } else {
      setActiveView(view);
      setProductToEdit(null);
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product); // Pass product data to edit
    setActiveView('edit');
  };

  const handleUpdateComplete = () => {
    setActiveView('view');
  };

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
      overflowY="auto" // Enable vertical scrolling
      maxHeight={{
        base: '450px',
        sm: '500px',
        md: '550px',
        lg: '600px',
        xl: '650px',
      }} // Responsive max height
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Produk : {activeView === 'create' && 'Tambah'}
          {activeView === 'view' && 'Informasi'}
          {activeView === 'edit' && 'Edit'}
        </Text>
        <MainMenu onMenuClick={handleMenuClick} isExpanded={isExpanded} />
      </Flex>

      {activeView === 'create' && <CreateProduct />}
      {activeView === 'view' && <ViewProduct onEdit={handleEdit} />}
      {activeView === 'edit' && (
        <UpdateProduct
          product={productToEdit}
          onUpdateComplete={handleUpdateComplete}
        />
      )}
    </Card>
  );
}
