import { query } from '../../../lib/db';

export async function GET() {
  try {
    // Usamos el nombre exacto en minúsculas sin comillas dobles
    const res = await query('SELECT * FROM registroordenpedido');
    return Response.json(res.rows);
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}