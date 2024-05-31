import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        const response = await fetch(`/api/get_product_info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ id })
        });

        if (response.ok) {
          const result = await response.json();
          setProduct(result);
          setLoading(false);
        } else {
          alert('Failed to fetch product info');
          setLoading(false);
        }
      } catch (error) {
        alert('Error fetching product info: ' + error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product information available</div>;
  }

  return (
    <div>
      <h1>Product Info for ID: {id}</h1>
      <p>Name: {product.name}</p>
      <p>Code: {product.code}</p>
      <p>Unit: {product.unit}</p>
      <p>Rate: {product.rate}</p>
      {/* Add more fields as necessary */}
    </div>
  );
}


