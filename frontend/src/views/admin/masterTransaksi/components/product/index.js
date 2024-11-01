import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Card from 'components/card/Card';
import MainMenu from 'components/menu/MainMenu'; // Ensure component name is correct
import CreateProduct from './createProduct';
import ViewProduct from './viewProduct';

export default function Products({ onExpand, isExpanded }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [activeView, setActiveView] = useState('view');

  const handleMenuClick = (view) => {
    if (view === 'expand') {
      onExpand(); // Call the onExpand function passed from the parent
    } else {
      setActiveView(view);
    }
  };

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Products
        </Text>
        <MainMenu onMenuClick={handleMenuClick} isExpanded={isExpanded} />
      </Flex>

      {activeView === 'create' ? <CreateProduct /> : <ViewProduct />}
    </Card>
  );
}
