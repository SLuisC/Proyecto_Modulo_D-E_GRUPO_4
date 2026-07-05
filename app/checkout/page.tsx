// app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  // Estados para el Carrito
  const [carrito, setCarrito] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  
  // Estados para el Checkout y validación (Añadido 'comprobante')
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    secretaria_cedulas: '',
    comprobante: '' 
  });
  const [productos, setProductos] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [nombreSecretaria, setNombreSecretaria] = useState(''); 
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []));

    fetch('/api/secretarias')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSecretarias(data);
        else if (data && Array.isArray(data.data)) setSecretarias(data.data);
        else if (data && Array.isArray(data.secretarias)) setSecretarias(data.secretarias);
        else setSecretarias([]);
      })
      .catch(err => console.error("Error cargando secretarias:", err));
  }, []);

  // --- LÓGICA DEL CARRITO ---
  const agregarAlCarrito = () => {
    if (!productoSeleccionado || cantidad < 1) return;
    
    const pInfo: any = productos.find((p: any) => p.productoid == productoSeleccionado);
    if (!pInfo) return;

    const nuevoItem = {
      productoid: pInfo.productoid,
      producto: pInfo.producto,
      precio: parseFloat(pInfo.precio),
      cantidad: parseInt(cantidad.toString()),
      subtotal: parseFloat(pInfo.precio) * parseInt(cantidad.toString())
    };

    setCarrito([...carrito, nuevoItem]);
    
    // Limpiar selección para el siguiente
    setProductoSeleccionado('');
    setCantidad(1);
  };

  const eliminarDelCarrito = (index: number) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  // --- LÓGICA DEL CHECKOUT ---
  const handleValidarSecretaria = () => {
    const idBuscado = formData.secretaria_cedulas.trim().toLowerCase();
    if (!idBuscado) {
      setNombreSecretaria('Por favor, ingresa un ID.');
      return;
    }
    const sec: any = secretarias.find(
      (s: any) => s.cedulas && s.cedulas.trim().toLowerCase() === idBuscado
    );
    if (sec) {
      setNombreSecretaria(`${sec.nombre} ${sec.apellido}`);
    } else {
      setNombreSecretaria('❌ Cédula/ID no encontrado');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carrito.length === 0) {
      setMensaje('Error: El carrito está vacío.');
      return;
    }
    if (nombreSecretaria.includes('❌') || !nombreSecretaria) {
      setMensaje('Error: Valida la secretaria antes de continuar.');
      return;
    }
    if (!formData.comprobante.trim()) {
      setMensaje('Error: El número de comprobante es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    setMensaje('Procesando pedido...');

    try {
      // Guardamos CADA producto del carrito enviando además el comprobante
      const promesas = carrito.map(item => 
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productoid: item.productoid,
            cantidad: item.cantidad,
            costounitario: item.precio,
            fecha: formData.fecha,
            secretaria_cedulas: formData.secretaria_cedulas.trim(),
            comprobante: formData.comprobante.trim() // Enviado a la API
          })
        })
      );

      // Esperamos a que todos se guarden
      const respuestas = await Promise.all(promesas);
      const todosExitosos = respuestas.every(res => res.ok);

      if (todosExitosos) {
        setMensaje('✅ ¡Pedido registrado con éxito!');
        setCarrito([]); // Vaciamos carrito
        setFormData({ fecha: new Date().toISOString().split('T')[0], secretaria_cedulas: '', comprobante: '' });
        setNombreSecretaria('');
      } else {
        setMensaje('⚠️ Algunos productos no se pudieron guardar.');
      }
    } catch (error) {
      setMensaje('❌ Error de conexión al procesar el pago.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>🛒 Punto de Venta (Módulos D y E)</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        
        {/* COLUMNA IZQUIERDA: AGREGAR PRODUCTOS */}
        <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>1. Agregar al Carrito</h3>
          
          <label>Producto:</label><br/>
          <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
            <option value="">-- Selecciona --</option>
            {productos.map((p: any) => (
              <option key={p.productoid} value={p.productoid}>
                {p.producto} - ${p.precio} (Stock: {p.stock})
              </option>
            ))}
          </select>

          <label>Cantidad:</label><br/>
          <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

          <button onClick={agregarAlCarrito} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            + Añadir al Carrito
          </button>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DEL CARRITO */}
        <div style={{ flex: 1 }}>
          <h3>🛍️ Resumen del Carrito</h3>
          {carrito.length === 0 ? (
            <p style={{ color: '#666' }}>El carrito está vacío.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9e9e9', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Producto</th>
                  <th>Cant.</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: '8px' }}>{item.producto}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                    <td>
                      <button onClick={() => eliminarDelCarrito(i)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✖</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold', padding: '8px' }}>Total a Pagar:</td>
                  <td colSpan={2} style={{ fontWeight: 'bold', color: '#0070f3' }}>${totalCarrito.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      <hr style={{ margin: '30px 0' }} />

      {/* SECCIÓN INFERIOR: CHECKOUT Y PAGO */}
      <h3>2. Confirmación y Datos (Checkout)</h3>
      
      {/* CUADRO DE DATOS BANCARIOS */}
      <div style={{ backgroundColor: '#e8f4fd', border: '1px solid #b8daff', padding: '15px', borderRadius: '6px', marginBottom: '20px', color: '#004085' }}>
        <strong>🏦 Información de Pago (Transferencia Bancaria):</strong>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem' }}>
          Realiza tu depósito a la <strong>Cuenta Corriente #2200456781</strong> - Banco Pichincha.<br/>
          A nombre de: <strong>Distribuidora Grupo 4 S.A.</strong> (RUC: 1792345678001).
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        
        <div>
          <label>Cédula Secretaria:</label><br/>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="text" 
              value={formData.secretaria_cedulas}
              onChange={(e) => {
                setFormData({ ...formData, secretaria_cedulas: e.target.value });
                setNombreSecretaria('');
              }} 
              required 
              style={{ flex: 1, padding: '8px' }} 
            />
            <button type="button" onClick={handleValidarSecretaria} style={{ padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
              Validar
            </button>
          </div>
          {nombreSecretaria && (
            <small style={{ color: nombreSecretaria.includes('❌') ? 'red' : 'green', display: 'block', marginTop: '5px' }}>
              {nombreSecretaria}
            </small>
          )}
        </div>

        <div>
          <label>Fecha de Transferencia:</label><br/>
          <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* NUEVO CAMPO: NÚMERO DE COMPROBANTE */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Número de Referencia / Comprobante:</label><br/>
          <input 
            type="text" 
            placeholder="Ej: 98745612" 
            value={formData.comprobante} 
            onChange={(e) => setFormData({ ...formData, comprobante: e.target.value })} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          {mensaje && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da', color: mensaje.includes('✅') ? '#155724' : '#721c24' }}>
              {mensaje}
            </div>
          )}
          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {isSubmitting ? 'Procesando...' : `Confirmar y Pagar $${totalCarrito.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}