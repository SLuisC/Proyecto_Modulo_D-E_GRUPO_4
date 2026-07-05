// app/api/admin/update/route.js
import { query } from '../../../../lib/db';

export async function POST(req) {
  try {
    const { pedidoid, nuevoEstado } = await req.json();

    // Actualizamos el estado en la base de datos
    await query(
      `UPDATE registroordenpedido SET estado = $1 WHERE pedidoid = $2`,
      [nuevoEstado, pedidoid]
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}