// Chakra imports
import { Box, Grid } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/profile/components/Banner';

// Assets
import banner from 'assets/img/auth/admin.jpg';
import avatar from 'assets/img/avatars/1735780582235.jpg';
import React from 'react';

export default function Overview() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr', // Single column for all screen sizes
        }}
        templateRows={{
          base: '1fr', // Single row for all screen sizes
        }}
        gap="20px" // Uniform gap between elements
      >
        <Banner
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />
      </Grid>
    </Box>
  );
}
