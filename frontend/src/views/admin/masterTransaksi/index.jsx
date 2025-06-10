// Chakra imports
import { Box, SimpleGrid } from '@chakra-ui/react';

import React from 'react';
import Products from './components/product';
import Costs from './components/cost';
import Ingredients from './components/ingredient';
import Tools from './components/tool';

export default function Settings() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const handleExpand = () => {
    setIsExpanded((prev) => !prev); // Toggle between expanded and not
  };

  // Chakra Color Mode
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={isExpanded ? 1 : { sm: 1, md: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <Products onExpand={handleExpand} isExpanded={isExpanded} />
        <Costs onExpand={handleExpand} isExpanded={isExpanded} />
        <Ingredients onExpand={handleExpand} isExpanded={isExpanded} />
        <Tools onExpand={handleExpand} isExpanded={isExpanded} />
      </SimpleGrid>
    </Box>
  );
}
