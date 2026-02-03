import api from './api';

export const getAllProducts = async () => {
  try {
    console.log('🔍 Chamando API: /products');
    const response = await api.get('/products');
    console.log('📦 Resposta da API:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Erro na API de produtos:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Erro ao buscar produtos por categoria:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
