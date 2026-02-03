import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/number/${orderNumber}`);
  return response.data.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data.data;
};

export const getSalesStats = async () => {
  const response = await api.get('/orders/stats/sales');
  return response.data.data;
};
