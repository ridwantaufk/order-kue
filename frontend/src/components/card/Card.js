import { Box, useStyleConfig } from '@chakra-ui/react';
function Card(props) {
  const { variant, children, hidden, ...rest } = props;
  const styles = useStyleConfig('Card', { variant });

  return (
    <Box
      __css={styles}
      {...rest}
      style={{ display: hidden ? 'none' : 'block' }}
    >
      {children}
    </Box>
  );
}

export default Card;
