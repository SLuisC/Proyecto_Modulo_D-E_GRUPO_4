// app/api/orders/route.js
import { query } from '../../../lib/db';

export async function POST(req) {
  try {
    // 1. AÑADIMOS 'comprobante' a la recepción de datos
    const { cantidad, costounitario, fecha, secretaria_cedulas, productoid, comprobante } = await req.json();

    // 2. Consultamos stock actual y validamos existencia
    const prod = await query(`SELECT stock FROM producto WHERE productoid = $1`, [productoid]);

    if (prod.rows.length === 0) {
      return Response.json({ success: false, error: 'Producto no encontrado.' }, { status: 404 });
    }

    const stockActual = prod.rows[0].stock;

    // 3. Validación de stock
    if (stockActual < cantidad) {
      return Response.json({ success: false, error: `Stock insuficiente. Disponible: ${stockActual}` }, { status: 400 });
    }

    // 4. INSERT con la nueva columna 'comprobante' y el valor $6
    await query(
      `INSERT INTO registroordenpedido (productoid, cantidad, costounitario, fecha, secretaria_cedulas, comprobante) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [productoid, cantidad, costounitario, fecha, secretaria_cedulas, comprobante]
    );

    // 5. Descontamos el stock
    await query(`UPDATE producto SET stock = stock - $1 WHERE productoid = $2`, [cantidad, productoid]);
    
    return Response.json({ success: true });
    
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}