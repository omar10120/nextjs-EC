// src/app/api/orders/route.js
import db from '@/lib/db';

// Handle GET requests to fetch all orders for a specific user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'User ID is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Fetch orders for the user
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
      [userId]
    );

    // Fetch items for each order
    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.query(
          'SELECT oi.id, oi.quantity, p.name, p.price FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
          [order.id]
        );
        return { ...order, items   };
      })
    );

    return new Response(JSON.stringify(orderDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json OrderLength: ' + orderDetails.length  },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to fetch orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle POST requests to create a new order
export async function POST(request) {
  try {
    const { userId, cartItems, totalPrice } = await request.json();

    if (!userId || !cartItems || cartItems.length === 0 || !totalPrice) {
      return new Response(
        JSON.stringify({ error: 'User ID, cart items, and total price are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert a new order
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
      [userId, totalPrice]
    );
    const orderId = orderResult.insertId;

    // Insert each product into order_items
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.id, item.quantity || 1]
      );
    }

    return new Response(
      JSON.stringify({ message: 'Order placed successfully', orderId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to place order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
