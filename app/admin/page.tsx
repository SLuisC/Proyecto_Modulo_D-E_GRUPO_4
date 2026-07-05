// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [pedidos, setPedidos] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resPedidos, resSecretarias] = await Promise.all([
        fetch('/api/admin/orders'), 
        fetch('/api/secretarias')
      ]);
      
      const dataPedidos = await resPedidos.json();
      const dataSecretarias = await resSecretarias.json();
      
      setPedidos(dataPedidos);
      
      if (Array.isArray(dataSecretarias)) setSecretarias(dataSecretarias);
      else if (dataSecretarias && Array.isArray(dataSecretarias.data)) setSecretarias(dataSecretarias.data);
      else if (dataSecretarias && Array.isArray(dataSecretarias.secretarias)) setSecretarias(dataSecretarias.secretarias);
      else setSecretarias([]);

      setLoading(false);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getNombreSecretaria = (id_guardado: string) => {
    if (!id_guardado) return 'Sin asignar';
    
    const sec: any = secretarias.find((s: any) => 
      s.cedulas && s.cedulas.trim().toLowerCase() === id_guardado.trim().toLowerCase()
    );
    
    return sec ? `${sec.nombre} ${sec.apellido}` : id_guardado;
  };

  const handleUpdateStatus = async (pedidoid: number) => {
    const confirmar = window.confirm(`¿Aprobar el pago del pedido #${pedidoid}?`);
    if (!confirmar) return;

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoid, estado: 'Pagado ✅' })
      });
      
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert('Error al validar el pago');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando panel administrativo...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        Backoffice - Gestión de Pedidos (Módulo E)
      </h1>
      
      <table border={1} cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Costo Unit.</th>
            <th>Total</th>
            <th>N° Comprobante</th>
            <th>Secretaria Responsable</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p: any) => (
            <tr key={p.pedidoid}>
              <td>{p.pedidoid}</td>
              <td>{p.producto || 'Desconocido'}</td>
              <td>{p.cantidad}</td>
              <td>${p.costounitario}</td>
              <td><strong>${(p.cantidad * p.costounitario).toFixed(2)}</strong></td>
              <td style={{ fontFamily: 'monospace', color: '#555', textAlign: 'center' }}>
                {p.comprobante || 'Sin comprobante'}
              </td>
              <td>{getNombreSecretaria(p.secretaria_cedulas)}</td>
              <td>
                <span style={{ color: p.estado?.includes('Pagado') ? 'green' : 'orange', fontWeight: 'bold' }}>
                  {p.estado || 'Pendiente'}
                </span>
              </td>
              <td>
                {p.estado !== 'Pagado ✅' && (
                  <button 
                    onClick={() => handleUpdateStatus(p.pedidoid)}
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Validar Pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}