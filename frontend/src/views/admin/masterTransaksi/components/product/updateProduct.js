// frontend/src/views/admin/masterTransaksi/components/product/updateProduct.js
import React, { useState, useEffect } from 'react';
import { Button, Input, FormControl, FormLabel } from '@chakra-ui/react';

export default function UpdateProduct({ product, onSave, onCancel }) {
  const [productName, setProductName] = useState(product ? product.name : '');
  const [productPrice, setProductPrice] = useState(
    product ? product.price : '',
  );

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductPrice(product.price);
    }
  }, [product]);

  const handleSave = () => {
    onSave({ ...product, name: productName, price: productPrice });
  };

  return (
    <div>
      <FormControl mb="4">
        <FormLabel>Product Name</FormLabel>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Product Price</FormLabel>
        <Input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Enter product price"
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSave} mr="4">
        Save
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  );
}
