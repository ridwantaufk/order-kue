import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Card from 'components/card/Card';
import MainMenu from 'components/menu/MainMenu';
import CreateIngredient from './createIngredient'; // Changed from CreateProduct
import ViewIngredient from './viewIngredient'; // Changed from ViewProduct
import UpdateIngredient from './updateIngredient'; // Changed from UpdateProduct

export default function Ingredients({ onExpand, isExpanded }) {
  // Changed from 'Products' to 'Ingredients'
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [activeView, setActiveView] = useState('view');
  const [ingredientToEdit, setIngredientToEdit] = useState(null); // Changed from 'product' to 'ingredient'

  const handleMenuClick = (view) => {
    if (view === 'expand') {
      onExpand();
    } else {
      setActiveView(view);
      setIngredientToEdit(null); // Changed from 'product' to 'ingredient'
    }
  };

  const handleEdit = (ingredient) => {
    setIngredientToEdit(ingredient);
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
          Bahan-bahan : {activeView === 'create' && 'Tambah'}
          {activeView === 'view' && 'Informasi'}
          {activeView === 'edit' && 'Edit'}
        </Text>
        <MainMenu onMenuClick={handleMenuClick} isExpanded={isExpanded} />
      </Flex>

      <Flex overflowX="auto">
        {' '}
        {activeView === 'create' && <CreateIngredient />}
        {activeView === 'view' && <ViewIngredient onEdit={handleEdit} />}
        {activeView === 'edit' && (
          <UpdateIngredient
            ingredient={ingredientToEdit} // Changed from 'product' to 'ingredient'
            onUpdateComplete={handleUpdateComplete}
          />
        )}
      </Flex>
    </Card>
  );
}
