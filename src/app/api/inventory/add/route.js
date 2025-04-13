import pool from '@/lib/db';

export async function POST(req) {
    const { name, category, quantity, price } = await req.json();
    try {
        const result = await pool.query(
            `INSERT INTO inventory (name, category, quantity, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, category, quantity, price]
        );

        const item = result.rows[0];

        // Log to ledger
        await pool.query(
            `INSERT INTO ledger (operation_type, item_name, category, new_quantity, new_price)
       VALUES ('INSERT', $1, $2, $3, $4)`,
            [item.name, item.category, item.quantity, item.price]
        );

        return new Response(JSON.stringify(item), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
