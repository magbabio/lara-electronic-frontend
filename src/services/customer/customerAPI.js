import { API_URL } from 'src/config';

import { http } from '../http';

const API =  API_URL;

export const createCustomerRequest =  customer => http.post(`${API}/customers/create`, customer);

export const getCustomerRequest = id => http.get(`${API}/customers/getCustomer/${id}`);

export const getCustomersRequest = async () => 
  http.get(`${API}/customers/getAll`);

export const getDeletedCustomersRequest = async () => 
  http.get(`${API}/customers/getAllDeleted`);

export const updateCustomerRequest = (id, customer) => 
      http.put(`${API}/customers/update/${id}`, customer);

export const deleteCustomerRequest = id => http.delete(`${API}/customers/delete/${id}`);

export const activateCustomerRequest = id => http.put(`${API}/customers/activate/${id}`);

export const getCustomerByDocumentRequest = (document_type, document_number) => 
    http.get(`${API}/customers/getCustomerByDocument/${document_type}/${document_number}`);
