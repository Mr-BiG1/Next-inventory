import pool from '@/lib/db';

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    const prev = await pool.query(`SELECT * FROM inventory WHERE id = $1`, [id]);
    const item = prev.rows[0];

    await pool.query(
      `INSERT INTO ledger (operation_type, item_name, category, previous_quantity, previous_price)
       VALUES ('DELETE', $1, $2, $3, $4)`,
      [item.name, item.category, item.quantity, item.price]
    );

    await pool.query(`DELETE FROM inventory WHERE id=$1`, [id]);

    return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
