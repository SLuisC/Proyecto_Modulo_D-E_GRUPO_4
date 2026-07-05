// app/api/empleados/route.js
import { query } from '../../../lib/db';

export async function GET() {
  try {
    // Filtramos solo los que tengan cargo de 'Secretaria' si es necesario, 
    // o traemos todos para que el buscador funcione mejor
    const res = await query('SELECT cedulae, nombre, apellido FROM empleado');
    return Response.json(res.rows || []);
  } catch (error) {
    return Response.json([]);
  }
}