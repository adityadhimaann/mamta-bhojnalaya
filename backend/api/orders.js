import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = `
        SELECT o.id, o.total_price, o.status, o.created_at,
               COALESCE(json_agg(json_build_object('name', oi.menu_item_name, 'quantity', oi.quantity, 'size', oi.size)) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { id, items, total } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const orderQuery = 'INSERT INTO orders(id, total_price, status) VALUES($1, $2, $3)';
      await client.query(orderQuery, [id, total, 'pending']);
      for (const item of items) {
        const itemQuery = 'INSERT INTO order_items(order_id, menu_item_name, quantity, size, price_at_order) VALUES ($1, $2, $3, $4, $5)';
        await client.query(itemQuery, [id, item.name, item.quantity, item.size, item.price]);
      }
      await client.query('COMMIT');
      res.status(201).json({ message: 'Order created successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}