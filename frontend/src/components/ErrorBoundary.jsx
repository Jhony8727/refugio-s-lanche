import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary capturou erro:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%'
          }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>🍔 Refugio's Lanche</h1>
            <h2 style={{ color: '#ff6b35', marginBottom: '20px' }}>❌ Ops! Algo deu errado</h2>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <h3>Erro:</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
              
              <h3 style={{ marginTop: '20px' }}>Detalhes:</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9em' }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '1.2em',
                borderRadius: '50px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Recarregar Página
            </button>

            <button
              onClick={() => window.location.href = '/test.html'}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '1.2em',
                borderRadius: '50px',
                cursor: 'pointer'
              }}
            >
              🧪 Página de Teste
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
