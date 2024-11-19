import React from 'react';
import ProductGrid from './ProductGrid';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  return (
    <div className="App">
      <ProductGrid products={data} />
    </div>
  );
}

export default App;
