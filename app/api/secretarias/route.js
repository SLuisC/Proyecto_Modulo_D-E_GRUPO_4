// app/api/secretarias/route.js
import { query } from '../../../lib/db';

export async function GET() {
  try {
    // Usamos 'query' tal como lo haces en products
    const res = await query('SELECT cedulas, nombre, apellido FROM secretaria');
    
    // Devolvemos el JSON con los datos
    return Response.json(res.rows || []);
  } catch (error) {
    console.error("Error en API secretarias:", error);
    return Response.json([]); 
  }
}