// Página 404 estática simples
// Página 404 ultra-simples sem metadata ou viewport
export default function NotFound() {
  return (
    <html lang="pt-BR">
      <head>
        <title>404 - Página não encontrada</title>
      </head>
      <body style={{
        margin: 0,
        padding: '50px',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        backgroundColor: '#fef9e7'
      }}>
        <h1 style={{ color: '#7c2d12', fontSize: '3rem' }}>404</h1>
        <h2 style={{ color: '#92400e' }}>Página não encontrada</h2>
        <p style={{ color: '#a16207' }}>
          A página que você procura não existe.
        </p>
        <a href="/" style={{
          color: '#ec4899',
          textDecoration: 'none',
          padding: '10px 20px',
          border: '2px solid #ec4899',
          borderRadius: '5px',
          display: 'inline-block',
          marginTop: '20px'
        }}>
          Voltar ao início
        </a>
      </body>
    </html>
  )
}
