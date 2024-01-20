import axios from 'axios'

import { API_URL } from 'src/config'

export const URL = API_URL

export const http = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})