import { API_URL } from 'src/config';

import { http } from '../http';

const API =  API_URL;

export const createOrderRequest =  order => http.post(`${API}/orders/create`, order);

export const getOrderRequest = id => http.get(`${API}/orders/getOrder/${id}`);

export const getOrdersRequest = async () => 
  http.get(`${API}/orders/getAll`);

export const getDeletedOrdersRequest = async () => 
  http.get(`${API}/orders/getAllDeleted`);

export const updateOrderRequest = (id, order) => 
  http.put(`${API}/orders/update/${id}`, order);

export const deleteOrderRequest = id => http.delete(`${API}/orders/delete/${id}`);

export const activateOrderRequest = id => http.put(`${API}/orders/activate/${id}`);

export const generateOrderDocumentRequest = id => 
  http.get(`${API}/orders/generateOrderDocument/${id}`, { responseType: 'blob' });

export const sendOrderEmailRequest = id => 
  http.get(`${API}/orders/sendOrderEmail/${id}`);

export const searchOrderByEquipmentSerial = (serial) => 
  http.get(`${API}/orders/searchOrderByEquipmentSerial/${serial}/`);
