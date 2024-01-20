import { API_URL } from 'src/config';

import { http } from '../http';

const API =  API_URL;

export const createUserRequest =  user => http.post(`${API}/users/create`, user);

export const getUserRequest = id => http.get(`${API}/users/getUser/${id}`);

export const getUsersRequest = async () => 
  http.get(`${API}/users/getAll`);

export const getDeletedUsersRequest = async () => 
  http.get(`${API}/users/getAllDeleted`);

export const updateUserRequest = (id, user) => 
      http.put(`${API}/users/update/${id}`, user);

export const deleteUserRequest = id => http.delete(`${API}/users/delete/${id}`);

export const activateUserRequest = id => http.put(`${API}/users/activate/${id}`);