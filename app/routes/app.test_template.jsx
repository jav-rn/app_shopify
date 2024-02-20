import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios si lo estás utilizando

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/shopify/products'); // Endpoint de tu servidor intermedio
        if (response.status === 200) {
          setProducts(response.data.products);
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Renderiza tus productos aquí */}
    </div>
  );
};

export default Products;
