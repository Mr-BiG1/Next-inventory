import pool from '@/lib/db';

export async function PUT(req) {
    const { id, name, category, quantity, price } = await req.json();

    try {
        const prev = await pool.query(`SELECT * FROM inventory WHERE id = $1`, [id]);
        const old = prev.rows[0];

        await pool.query(
            `UPDATE inventory SET name=$1, category=$2, quantity=$3, price=$4 WHERE id=$5`,
            [name, category, quantity, price, id]
        );

        await pool.query(
            `INSERT INTO ledger (operation_type, item_name, category, previous_quantity, new_quantity, previous_price, new_price)
       VALUES ('UPDATE', $1, $2, $3, $4, $5, $6)`,
            [name, category, old.quantity, quantity, old.price, price]
        );

        return new Response(JSON.stringify({ message: 'Updated' }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
