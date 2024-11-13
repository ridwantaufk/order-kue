import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Card from 'components/card/Card';
import MainMenu from 'components/menu/MainMenu';
import CreateCost from './createCost'; // Changed from CreateProduct
import ViewCost from './viewCost'; // Changed from ViewProduct
import UpdateCost from './updateCost'; // Changed from UpdateProduct

export default function Costs({ onExpand, isExpanded }) {
  // Changed from 'Products' to 'Costs'
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [activeView, setActiveView] = useState('view');
  const [costToEdit, setCostToEdit] = useState(null); // Changed from 'product' to 'cost'

  const handleMenuClick = (view) => {
    if (view === 'expand') {
      onExpand();
    } else {
      setActiveView(view);
      setCostToEdit(null); // Changed from 'product' to 'cost'
    }
  };

  const handleEdit = (cost) => {
    console.log('cost : ', cost);
    setCostToEdit(cost);
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
      overflowX={{ sm: 'scroll', md: 'scroll', lg: 'scroll' }}
      overflowY="auto"
      maxHeight={{
        base: '450px',
        sm: '500px',
        md: '550px',
        lg: '600px',
        xl: '650px',
      }}
    >
      <Flex
        px="25px"
        mb="8px"
        justifyContent="space-between"
        align="center"
        position="sticky"
        top="0"
        zIndex="1"
        whiteSpace="nowrap"
      >
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Biaya : {activeView === 'create' && 'Tambah'}
          {activeView === 'view' && 'Informasi'}
          {activeView === 'edit' && 'Edit'}
        </Text>
        <MainMenu onMenuClick={handleMenuClick} isExpanded={isExpanded} />
      </Flex>

      <Flex overflowX="auto">
        {' '}
        {activeView === 'create' && <CreateCost />}
        {activeView === 'view' && <ViewCost onEdit={handleEdit} />}
        {activeView === 'edit' && (
          <UpdateCost
            cost={costToEdit} // Changed from 'product' to 'cost'
            onUpdateComplete={handleUpdateComplete}
          />
        )}
      </Flex>
    </Card>
  );
}
