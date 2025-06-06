import { useState, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export const useMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [selectedTotalPrice, setSelectedTotalPrice] = useState({});
  const [totQuantity, setTotQuantity] = useState(0);
  const [totPrice, setTotPrice] = useState(0);
  const [temporaryQuantity, setTemporaryQuantity] = useState({});
  const [temporaryPrice, setTemporaryPrice] = useState({});
  const [deleteInput, setDeleteInput] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [terlaris, setTerlaris] = useState(false);

  const toast = useToast();
  const toastId = useRef(null);
  const deleteInputRef = useRef(deleteInput);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } },
      );

      const sortedData = response.data.sort((a, b) =>
        a.product_name.localeCompare(b.product_name),
      );

      setProducts(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (terlaris) fetchProducts();
    setActiveCategory(category);

    const categoryKeywords = {
      makanan: 'brownies',
      minuman: 'minuman',
      semua: '',
    };
    setSearchKeyword(categoryKeywords[category] || '');
  };

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedQuantity((prev) => ({ ...prev, [id]: newQuantity }));
  };

  const handleTotalPriceChange = (id, newTotalPrice) => {
    setSelectedTotalPrice((prev) => ({ ...prev, [id]: newTotalPrice }));
  };

  useEffect(() => {
    fetchProducts();
    return () => {
      if (toastId.current) {
        toast.close(toastId.current);
        toastId.current = null;
      }
      setSelectedQuantity({});
      setSelectedTotalPrice({});
    };
  }, []);

  useEffect(() => {
    deleteInputRef.current = deleteInput;
  }, [deleteInput]);

  useEffect(() => {
    const totalQuantity = Object.values(selectedQuantity).reduce(
      (acc, cur) => acc + cur,
      0,
    );
    const totalPrice = Object.values(selectedTotalPrice).reduce(
      (acc, cur) => acc + cur,
      0,
    );

    setTotQuantity(totalQuantity);
    setTotPrice(totalPrice);

    if (
      Object.keys(selectedQuantity).length > 0 &&
      Object.keys(selectedTotalPrice).length > 0
    ) {
      setTemporaryQuantity(selectedQuantity);
      setTemporaryPrice(selectedTotalPrice);
    }
  }, [selectedQuantity, selectedTotalPrice]);

  return {
    products,
    loading,
    selectedQuantity,
    selectedTotalPrice,
    totQuantity,
    totPrice,
    temporaryQuantity,
    temporaryPrice,
    deleteInput,
    searchKeyword,
    activeCategory,
    terlaris,
    toast,
    toastId,
    deleteInputRef,
    setProducts,
    setSelectedQuantity,
    setSelectedTotalPrice,
    setTotQuantity,
    setTotPrice,
    setTemporaryQuantity,
    setTemporaryPrice,
    setDeleteInput,
    setSearchKeyword,
    setActiveCategory,
    setTerlaris,
    handleCategoryClick,
    handleQuantityChange,
    handleTotalPriceChange,
  };
};
