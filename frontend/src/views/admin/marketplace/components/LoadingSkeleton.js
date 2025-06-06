import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSkeleton = () => {
  const skeletonBgColor = useColorModeValue('#c2c2c2', '#240d4f');
  const skeletonColor = useColorModeValue('#f0f0f0', '#555');

  return (
    <Box
      padding="20px"
      display="flex"
      flexDirection="column"
      gap="20px"
      marginTop="80px"
    >
      <Flex direction={['column', 'row']} gap="20px">
        <Box flex="2">
          <Skeleton
            height="300px"
            width="100%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
          <Flex direction={['column', 'row']} gap="15px" marginTop="20px">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                height="calc(40vh - 100px)"
                width="15vw"
                baseColor={skeletonBgColor}
                highlightColor={skeletonColor}
              />
            ))}
          </Flex>
        </Box>
        <Box flex="1">
          <Skeleton
            height="calc(85vh - 100px)"
            width="100%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
        </Box>
      </Flex>
      <Box marginTop="20px">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            height="40px"
            width="100%"
            baseColor={skeletonBgColor}
            highlightColor={skeletonColor}
          />
        ))}
      </Box>
      <Box marginTop="20px">
        <Skeleton
          height="50px"
          width="30%"
          baseColor={skeletonBgColor}
          highlightColor={skeletonColor}
        />
      </Box>
    </Box>
  );
};

export default LoadingSkeleton;
