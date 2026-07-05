// app/page.tsx
export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1>Sistema de Gestión Grupo 4</h1>
      <p>Bienvenido al sistema integrado. Selecciona una opción:</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
        <a href="/checkout" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Ir a Ventas (Módulo D)</a>
        <a href="/admin" style={{ padding: '10px', backgroundColor: '#333', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Ir a Administración (Módulo E)</a>
      </div>
    </div>
  );
}