import { API_URL } from 'src/config';

import { http } from './http';

const API =  API_URL;

export const loginRequest = user => http.post(`${API}/auth/login `, user);

export const logoutRequest = async () => http.post(`${API}/auth/logout `);

export const verifyTokenRequest = async () => http.get(`${API}/auth/verifyToken`);


