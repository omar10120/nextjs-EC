// src/app/api/products/route.js

import db from '@/lib/db';

// Handle GET requests to fetch all products
export async function GET(request) {
  try {
    const [products] = await db.query('SELECT * FROM products');
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to fetch products' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle POST requests to add a new product
export async function POST(request) {
  try {
    const product = await request.json();

    if (!product.name || !product.price) {
      return new Response(
        JSON.stringify({ error: 'Product name and price are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [result] = await db.query(
      'INSERT INTO products (name, price, description, category) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.description || null, product.category || null]
    );

    product.id = result.insertId;

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to add product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle DELETE requests to delete a product by ID
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Product ID is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to delete product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle PUT requests to edit a product by ID
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Product ID is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const updatedData = await request.json();

    const [result] = await db.query(
      'UPDATE products SET name = ?, price = ?, description = ?, category = ? WHERE id = ?',
      [
        updatedData.name,
        updatedData.price,
        updatedData.description || null,
        updatedData.category || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ message: 'Product updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to update product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
