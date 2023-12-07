import { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import Header from '../common/Header';
import SideBar from '../common/SideBar';
import Context from '../../context';
import Products from './Products';

const Market = () => {
  const [products, setProducts] = useState([]);

  const { setIsLoading, hasNewProduct, setHasNewProduct } = useContext(Context);

  let loadProducts = null;

  useEffect(() => {
    loadProducts();
    return () => {
      setProducts([]);
    }
  }, [loadProducts]);

  useEffect(() => {
    if (hasNewProduct) {
      loadProducts();
      setHasNewProduct(false);
    }
  }, [hasNewProduct, loadProducts, setHasNewProduct]);

  loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = 'http://localhost:8080/products';
      const response = await axios.get(url);
      setProducts(() => response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [setIsLoading]);
  
  return (
    <div>
      <div id="header">
        <Header />
      </div>
      <div id="sidebarHome">
        <SideBar/>
        <Products products={products} />
      </div>
    </div>
  );
};
export default Market;