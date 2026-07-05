export const metadata = {
  title: 'Proyecto Módulo Grupo 4',
  description: 'MVP de Módulos D y E',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}