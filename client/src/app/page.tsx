export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🚀 Ayaz 3PL
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Lojistik Entegre Yönetim Sistemi
        </p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            background: 'white',
            color: '#667eea',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  )
}