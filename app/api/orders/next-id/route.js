// app/api/orders/next-id/route.js
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    // Buscamos el ID más alto actual
    const res = await query('SELECT MAX(pedidoid) as max_id FROM registroordenpedido');
    
    // Si no hay pedidos (null), el siguiente es 1. Si ya hay, sumamos 1.
    const currentMax = res.rows[0].max_id || 0;
    const nextId = currentMax + 1;
    
    return Response.json({ nextId });
  } catch (error) {
    console.error("Error obteniendo el próximo ID:", error);
    return Response.json({ nextId: 1 }); // Fallback a 1
  }
}