// app/api/products/route.js
import { query } from '../../../lib/db';

export async function GET() {
  try {
    // La consulta ahora selecciona 'producto' (el nombre del ítem) 
    // tal como aparece en tu esquema de base de datos
    const res = await query('SELECT productoid, producto, precio, stock FROM producto');
    
    // Devolvemos las filas asegurando que sea un arreglo
    return Response.json(res.rows || []);
  } catch (error) {
    console.error("Error en API products:", error);
    return Response.json([]); 
  }
}