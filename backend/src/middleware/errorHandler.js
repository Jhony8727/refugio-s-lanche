// Middleware global de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err);
  
  let error = { ...err };
  error.message = err.message;
  
  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      statusCode: 400,
      message: message.join(', ')
    };
  }
  
  // Erro de campo duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      statusCode: 400,
      message: `${field} já existe`
    };
  }
  
  // Erro de ObjectId inválido
  if (err.name === 'CastError') {
    error = {
      statusCode: 404,
      message: 'Recurso não encontrado'
    };
  }
  
  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Token inválido'
    };
  }
  
  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expirado'
    };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro no servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
