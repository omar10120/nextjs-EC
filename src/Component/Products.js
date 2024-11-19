'use client';
import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import ProductDetails from './ProductDetails';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter products based on the search query
    const lowerCaseQuery = searchQuery.toLowerCase();
    const queryAsNumber = parseFloat(searchQuery);

    const filtered = data.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) 
      ||(!isNaN(queryAsNumber) && product.price <= queryAsNumber) 
      
      
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      setData(result);
      setFilteredData(result); // Initialize filteredData with all products
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Set the selected product for details view
  };

  const handleBackToGrid = () => {
    setSelectedProduct(null); // Reset to show the product grid
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  const handleSearchChangeclear = (event) => {
    setSearchQuery(''); // Update search query
    product.value = '';
  };

  return (
    <div className="App">
      {selectedProduct ? (
        <ProductDetails product={selectedProduct} onBack={handleBackToGrid} />
      ) : (
        <div>
          {/* Search Bar */}
       

<div className='w-full flex justify-center py-5'>
  <div class="relative w-2/4">
    <input
      class="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
      id="product"
      onChange={handleSearchChange}

      type="text"
      placeholder="Search..."
      />
    <div class="absolute right-0 inset-y-0 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={()=> {handleSearchChangeclear()}}
        >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>

    <div class="absolute left-0 inset-y-0 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 ml-3 text-gray-400 hover:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
      </svg>
    </div>
  </div>
</div>         
          {/* end  searchbar */}

          {/* Product Grid */}
          {filteredData.length === 0 ? (
            <div role="status" className="h-60 flex items-center justify-center">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <ProductGrid products={filteredData} onProductClick={handleProductClick} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;