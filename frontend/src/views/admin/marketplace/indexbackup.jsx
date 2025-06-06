import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Flex,
  Text,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';
import Antrian from 'views/admin/marketplace/components/Antrian';
import Item from 'components/card/Item';
import Card from 'components/card/Card.js';
import LoadingSkeleton from './components/LoadingSkeleton';
import CategoryNav from './components/CategoryNav';
import PaymentDetailsModal from './components/PaymentDetailsModal';
import PaymentProcessModal from './components/PaymentProcessModal';
import OrderToast from './components/OrderToast';

// Custom hooks
import { useMarketplace } from './components/useMarketplace';
import { usePayment } from './components/usePayment';

export default function Marketplace() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const marketplace = useMarketplace();
  const payment = usePayment();

  // Toast management effect
  useEffect(() => {
    if (marketplace.totQuantity > 0) {
      const toastComponent = (
        <OrderToast
          totQuantity={marketplace.totQuantity}
          totPrice={marketplace.totPrice}
          onClick={handleToastClick}
          onClose={() => {
            marketplace.toast.close(marketplace.toastId.current);
            marketplace.toastId.current = null;
          }}
        />
      );

      if (marketplace.toastId.current) {
        marketplace.toast.update(marketplace.toastId.current, {
          render: () => toastComponent,
          status: 'info',
          duration: null,
          isClosable: true,
          position: 'bottom',
          variant: 'subtle',
          containerStyle: { width: '400px', height: 'auto', cursor: 'pointer' },
        });
      } else {
        marketplace.toastId.current = marketplace.toast({
          render: () => toastComponent,
          status: 'info',
          duration: null,
          isClosable: true,
          position: 'bottom',
          variant: 'subtle',
          onCloseComplete: () => {
            if (marketplace.deleteInputRef.current) {
              marketplace.setSelectedQuantity({});
              marketplace.setSelectedTotalPrice({});
            }
          },
          containerStyle: { width: '400px', height: 'auto', cursor: 'pointer' },
        });
      }
    } else if (marketplace.totQuantity === 0 && marketplace.toastId.current) {
      marketplace.toast.close(marketplace.toastId.current);
      marketplace.toastId.current = null;
    }
  }, [marketplace.totQuantity, marketplace.totPrice]);

  const handleToastClick = () => {
    payment.setPaymentDetails({
      itemQuantity: marketplace.selectedQuantity,
      itemPrice: marketplace.selectedTotalPrice,
      quantity: marketplace.totQuantity,
      price: marketplace.totPrice,
    });
    marketplace.setTotQuantity(0);
    marketplace.setTotPrice(0);
    payment.setIsModalOpen(true);
    marketplace.setDeleteInput(false);
  };

  const closeModal = () => {
    marketplace.setDeleteInput(true);
    payment.setIsModalOpen(false);
    marketplace.setSelectedQuantity(marketplace.temporaryQuantity);
    marketplace.setSelectedTotalPrice(marketplace.temporaryPrice);
    marketplace.setTotQuantity(
      Object.values(marketplace.temporaryQuantity).reduce(
        (acc, cur) => acc + cur,
        0,
      ),
    );
    marketplace.setTotPrice(
      Object.values(marketplace.temporaryPrice).reduce(
        (acc, cur) => acc + cur,
        0,
      ),
    );
  };

  const formatCurrency = (value) => {
    if (value == null) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const filteredProducts = marketplace.products.filter((product) => {
    const productName = product.product_name.toLowerCase();

    if (marketplace.searchKeyword === 'brownies') {
      return productName.includes('brownies');
    }
    if (marketplace.searchKeyword === 'minuman') {
      return !productName.includes('brownies');
    }
    return true;
  });

  if (marketplace.loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      <PaymentDetailsModal
        isOpen={payment.isModalOpen}
        onClose={closeModal}
        paymentDetails={payment.paymentDetails}
        products={marketplace.products}
        onProcessPayment={() => payment.setIsPaymentModalOpen(true)}
      />

      <PaymentProcessModal
        isOpen={payment.isPaymentModalOpen}
        onClose={() => {
          if (payment.disabled) return payment.onOpen();
          payment.setIsPaymentModalOpen(false);
        }}
        payment={payment}
      />

      <Grid
        mb="20px"
        gridTemplateColumns={{
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(3, 1fr)',
          '2xl': '1fr 0.46fr',
        }}
        gap={{ base: '20px', xl: '20px', '2xl': '50px' }}
        display={{ base: 'block', lg: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{
            lg: '1 / 1 / 2 / 3',
            xl: '1 / 1 / 2 / 3',
            '2xl': '1 / 1 / 2 / 2',
          }}
        >
          <Banner
            setProducts={marketplace.setProducts}
            setSelectedQuantity={marketplace.setSelectedQuantity}
            setSelectedTotalPrice={marketplace.setSelectedTotalPrice}
            setActiveCategory={marketplace.setActiveCategory}
            setSearchKeyword={marketplace.setSearchKeyword}
            setTerlaris={marketplace.setTerlaris}
          />

          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'start', md: 'center' }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Pilih Menu
              </Text>
              <CategoryNav
                activeCategory={marketplace.activeCategory}
                onCategoryClick={marketplace.handleCategoryClick}
              />
            </Flex>

            <SimpleGrid columns={{ base: 2, md: 3 }} gap="20px">
              {filteredProducts.map((product) => (
                <Item
                  key={product.product_id}
                  id={product.product_id}
                  name={product.product_name}
                  price={formatCurrency(product.price)}
                  description={product.description}
                  image={
                    product.icon
                      ? `/assets/img/products/${product.icon}`
                      : '/assets/img/products/no-image.png'
                  }
                  onQuantityChange={marketplace.handleQuantityChange}
                  onTotalPriceChange={marketplace.handleTotalPriceChange}
                  selectedQuantity={marketplace.selectedQuantity}
                />
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>

        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        >
          <Card
            px="0"
            mt={{ base: '20px', lg: '0px' }}
            position={{ base: 'static', lg: 'fixed' }}
            top="110px"
            right={{ lg: '20px' }}
            width={{ lg: '32%', xl: '25%' }}
            boxShadow="md"
          >
            <Antrian />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
