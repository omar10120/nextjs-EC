import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, onProductClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onMoreDetails={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
