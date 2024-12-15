// Chakra imports
import { Box, SimpleGrid } from '@chakra-ui/react';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import { columnsDataComplex } from 'views/admin/dataTables/variables/columnsData';
import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex.json';
import React from 'react';

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </SimpleGrid>
    </Box>
  );
}
