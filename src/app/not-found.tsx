export default function NotFound() {
  return (
    <html lang="pt-BR">
      <head>
        <title>404 - Página não encontrada | Sabores de Zissou</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{margin: 0, padding: 0, minHeight: '100vh', background: 'linear-gradient(135deg, #fef9e7 0%, #fef3c7 50%, #fce7f3 100%)', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{maxWidth: '400px', width: '100%', textAlign: 'center', padding: '20px'}}>
          <div style={{marginBottom: '32px'}}>
            <div style={{fontSize: '72px', fontWeight: 'bold', color: '#c084fc', marginBottom: '16px'}}>404</div>
            <h1 style={{fontSize: '32px', fontWeight: 'bold', color: '#7c2d12', marginBottom: '8px', margin: 0}}>
              Página não encontrada
            </h1>
            <p style={{color: '#92400e', margin: '16px 0'}}>
              Oops! A página que você está procurando não existe ou foi movida.
            </p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <a 
              href="/" 
              style={{
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '40px', 
                padding: '0 16px', 
                backgroundColor: '#ec4899', 
                color: 'white', 
                borderRadius: '8px', 
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#db2777'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ec4899'}
            >
              🏠 Voltar ao Início
            </a>
            
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = '/';
                  }
                }
              }}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                padding: '8px 16px', 
                color: '#92400e', 
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#7c2d12'}
              onMouseOut={(e) => e.target.style.color = '#92400e'}
            >
              ← Voltar à página anterior
            </button>
          </div>

          <div style={{marginTop: '32px', fontSize: '14px', color: '#a16207'}}>
            <p style={{margin: 0}}>Se você acredita que isso é um erro, entre em contato conosco.</p>
          </div>
        </div>
      </body>
    </html>
  );
}