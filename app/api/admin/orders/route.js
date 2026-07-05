// app/api/admin/orders/route.js
import { query } from '../../../../lib/db';

// GET: Obtener todos los pedidos para listar en la tabla de administración
export async function GET() {
  try {
    // CORRECCIÓN: Agregamos o.comprobante al SELECT para que viaje al Frontend del admin
    const res = await query(`
      SELECT o.pedidoid, o.productoid, p.producto, o.cantidad, o.costounitario, o.fecha, o.secretaria_cedulas, o.estado, o.comprobante 
      FROM registroordenpedido o
      LEFT JOIN producto p ON o.productoid = p.productoid
      ORDER BY o.pedidoid DESC
    `);
    return Response.json(res.rows);
  } catch (error) {
    console.error("Error al listar pedidos en admin:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Cambiar el estado del pedido (Aprobar/Validar la Transferencia)
export async function PATCH(req) {
  try {
    const { pedidoid, estado } = await req.json();
    await query('UPDATE registroordenpedido SET estado = $1 WHERE pedidoid = $2', [estado, pedidoid]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error al cambiar estado de pedido:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}